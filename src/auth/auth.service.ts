import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserProvider } from '../user/providers/user-provider';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { SigninDto } from './dto/signin.dto';
import { Validator } from '../utils/validator';
import { User } from '../user/entities/user.entity';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';

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
    private readonly userSevice: UserService,
    /**
     * @description jwt config service to access jwt enviroment variables
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfigService: ConfigType<typeof jwtConfig>,
  ) {}

  createUser(createUserDto: CreateUserDto) {
    return this.userSevice.create(createUserDto);
  }

  async validateUser(username: string, password: string) {
    let user: User | null = null;
    // checking if user provided and email or a username both must be unique
    const isEmail = Validator.isEmail(username);
    try {
      if (isEmail) {
        user = await this.userSevice.findByEmail(username);
      } else {
        user = await this.userSevice.findByUsername(username);
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
    };
  }

  async signInUser(signinDto: SigninDto) {
    try {
      const user = await this.validateUser(
        signinDto.username,
        signinDto.password,
      );
      const accessToken = await this.jwtService.signAsync(user);
      const refreshToken = await this.jwtService.signAsync(user, {
        secret: this.jwtConfigService.jwtRefreshSecret,
        expiresIn: this.jwtConfigService.jwtRefreshExpiresIn,
      });

      return {
        user,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new RequestTimeoutException();
    }
  }

  findById(id: string) {
    return this.userSevice.findOne(id);
  }
}
