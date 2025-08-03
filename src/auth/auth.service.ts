import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UserProvider } from '../user/providers/user-provider';
import { CreateUserDto } from '../user/dto/create-user.dto';

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
    private readonly userProvider: UserProvider,
  ) { }

  createUser(createUserDto: CreateUserDto) {
    return this.userProvider.createUser(createUserDto);
  }
}
