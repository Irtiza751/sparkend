import { ApiProperty } from '@nestjs/swagger';
import { AuthProvider } from '../enums/auth-provider';

import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsBoolean,
  MinLength,
} from 'class-validator';
import { Roles } from '@/core/enums/roles.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'johndoe', description: 'Username of the user' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Password of the user' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: Roles, example: Roles.USER, required: false })
  @IsOptional()
  @IsEnum(Roles)
  role: Roles;

  @ApiProperty({
    enum: AuthProvider,
    example: AuthProvider.LOCAL,
    required: false,
  })
  @IsOptional()
  @IsEnum(AuthProvider)
  provider: AuthProvider;
}
