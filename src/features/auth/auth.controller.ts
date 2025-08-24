import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Public } from '@core/decorators/public.decorator';
import { SigninDto } from './dto/signin.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RefreshDto } from './dto/refresh.dto';
import { GeneratedTokens } from '@core/interfaces/generated-tokens.interface';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @Public()
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Post('/signin')
  @UseGuards(LocalAuthGuard)
  @Public()
  signIn(@Body() signinDto: SigninDto) {
    return this.authService.signInUser(signinDto);
  }

  @Post('/refresh')
  @Public()
  refreshTokens(@Body() refreshDto: RefreshDto): Promise<GeneratedTokens> {
    return this.authService.refreshTokens(refreshDto);
  }

  @Post('/forgot-password')
  @Public()
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('/reset-password/:token')
  @Public()
  resetPassword(
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(token, resetPasswordDto);
  }

  @Get('/verify-email/:token')
  @ApiBearerAuth('access-token')
  verifyUser(@Param('token') token: string) {
    // return req.user;
    return this.authService.verifyUserEmail(token);
  }

  @Get('/whoami')
  @ApiBearerAuth('access-token')
  whoami() {
    return {
      user: 'Hi there!',
    };
  }
}
