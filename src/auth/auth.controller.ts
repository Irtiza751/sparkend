import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Public } from '../decorators/public.decorator';
import { SigninDto } from './dto/signin.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RefreshDto } from './dto/refresh.dto';
import { GeneratedTokens } from '../interfaces/generated-tokens.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @UseGuards(LocalAuthGuard)
  @Public()
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Post('/signin')
  @UseGuards(LocalAuthGuard)
  @Public()
  signIn(@Body() siginDto: SigninDto) {
    return this.authService.signInUser(siginDto);
  }

  @Post('/refresh')
  @ApiBearerAuth('access-token')
  @Public()
  refreshTokens(@Body() refreshDto: RefreshDto): Promise<GeneratedTokens> {
    return this.authService.refreshTokens(refreshDto);
  }

  @Get('/whoami')
  @ApiBearerAuth('access-token')
  whoami() {
    return {
      user: 'Hi there!',
    };
  }
}
