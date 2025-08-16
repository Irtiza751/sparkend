import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '@/features/user/dto/create-user.dto';
import { UserService } from '@/features/user/user.service';
import * as bcrypt from 'bcryptjs';
import { SigninDto } from './dto/signin.dto';
import { Validator } from '@/utils/validator';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { RefreshDto } from './dto/refresh.dto';
import { JwtResponse } from '@/interfaces/jwt-response.interface';
import { JwtPayload } from '@/interfaces/jwt-payload.interface';
import { GeneratedTokens } from '@/interfaces/generated-tokens.interface';
import { User } from '../user/entities/user.entity';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { MailService } from '../mail/mail.service';
import { JwtVerification } from '@/interfaces/jwt-verification.interface';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { BaseResponse } from '@/interfaces/base-response';

@Injectable()
export class AuthService {
  constructor(
    /**
     * @description The JWT service is used to sign and verify JSON Web Tokens.
     */
    private readonly jwtService: JwtService,
    /**
     * @description The UserProvider is used to interact with user data.
     */
    private readonly userService: UserService,
    /**
     * @description jwt config service to access jwt environment variables
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfigService: ConfigType<typeof jwtConfig>,
    /**
     * @description mail service
     */
    private readonly mailService: MailService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const { user } = await this.userService.create(createUserDto);
    if (user) {
      const token = await this.jwtService.signAsync(
        {
          sub: user.id,
        },
        {
          secret: this.jwtConfigService.jwtVerificationSecret,
          expiresIn: '5m',
        },
      );
      try {
        await this.mailService.sendConfirmation({
          toEmail: user.email,
          name: user.username,
          endpoint: `/verify-email/${token}`,
        });
      } catch (error) {
        throw new InternalServerErrorException();
      }
      return user;
    }
  }

  async validateUser(username: string, password: string): Promise<JwtPayload> {
    let user: User | null = null;
    // checking if user provided and email or a username both must be unique
    const isEmail = Validator.isEmail(username);
    try {
      if (isEmail) {
        user = await this.userService.findByEmail(username);
      } else {
        user = await this.userService.findByUsername(username);
      }
    } catch (error) {
      throw new BadRequestException();
    }
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    // validate the user password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // returning the minimum user info
    return {
      sub: user.id,
      username: user.username,
      roles: user.roles.map((role) => role.name),
      email: user.email,
    };
  }

  async signInUser(signinDto: SigninDto) {
    try {
      const user = await this.validateUser(
        signinDto.username,
        signinDto.password,
      );

      const { accessToken, refreshToken } = await this.generateTokens(user);
      return {
        user,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new RequestTimeoutException();
    }
  }

  async refreshTokens(refreshDto: RefreshDto) {
    try {
      const jwtResponse = await this.jwtService.verifyAsync<JwtResponse>(
        refreshDto.token,
        {
          secret: this.jwtConfigService.jwtRefreshSecret,
        },
      );
      return this.generateTokens({
        email: jwtResponse.email,
        sub: jwtResponse.sub,
        username: jwtResponse.username,
        roles: jwtResponse.roles,
      });
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async generateTokens(
    jwtPayload: Omit<JwtResponse, 'iat' | 'exp' | 'iss'>,
  ): Promise<GeneratedTokens> {
    const accessToken = await this.jwtService.signAsync(jwtPayload);
    const refreshToken = await this.jwtService.signAsync(jwtPayload, {
      secret: this.jwtConfigService.jwtRefreshSecret,
      expiresIn: this.jwtConfigService.jwtRefreshExpiresIn,
    });

    return { accessToken, refreshToken };
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<BaseResponse> {
    const { email } = forgotPasswordDto;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email "${email} not found"`);
    }

    const token = await this.generateVerificationToken({ sub: user.id }, '24h');
    const endpoint = `/reset-password/${token}`;

    this.mailService.sendResetEmail({
      toEmail: user.email,
      name: user.username,
      endpoint,
    });

    return {
      message: 'we have sent you an email',
    };
  }

  async verifyUserEmail(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync<JwtVerification>(
        token,
        {
          secret: this.jwtConfigService.jwtVerificationSecret,
        },
      );

      Logger.log(payload);

      if (!payload) {
        throw new BadRequestException('invalid verification token');
      }

      await this.userService.markUserAsVerified(payload.sub);
      return {
        message: 'User verified successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message); // for debugging
    }
  }

  async resetPassword(
    token: string,
    resetPasswordDto: ResetPasswordDto,
  ): Promise<BaseResponse> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtVerification>(
        token,
        {
          secret: this.jwtConfigService.jwtVerificationSecret,
        },
      );

      Logger.log(payload);

      if (!payload) {
        throw new BadRequestException('invalid verification token');
      }
      await this.userService.update(payload.sub, resetPasswordDto);
      return {
        message: 'Password updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message); // for debugging
    }
  }

  findById(id: string) {
    return this.userService.findOne(id);
  }

  async generateVerificationToken(
    payload: Record<string, any>,
    expiryTime?: string,
  ): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: this.jwtConfigService.jwtVerificationSecret,
      expiresIn: expiryTime,
    });
  }
}
