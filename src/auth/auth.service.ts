import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UserProvider } from '../user/providers/user-provider';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';

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
  ) { }

  createUser(createUserDto: CreateUserDto) {
    return this.userSevice.create(createUserDto);
  }

  async validateUser(username: string, password: string) {
    const user = await this.userSevice.findByUsername(username);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      id: user.id,
      username: user.username,
      roles: user.roles,
    };
  }

  findById(id: string) {
    return this.userSevice.findOne(id);
  }
}
