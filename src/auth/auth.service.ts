import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UserProvider } from '../user/providers/user-provider';

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

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
