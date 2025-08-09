import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Public } from '../decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/signup')
  @Public()
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }
}
