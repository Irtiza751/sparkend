import { ApiProperty } from '@nestjs/swagger';
import { AuthProvider } from '../enums/auth-provider';
import { UserRoles } from '../../role/enums/user-role.enum';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsBoolean,
  MinLength,
} from 'class-validator';

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

  @ApiProperty({ enum: UserRoles, example: UserRoles.USER, required: false })
  @IsOptional()
  @IsEnum(UserRoles)
  role: UserRoles;

  @ApiProperty({
    enum: AuthProvider,
    example: AuthProvider.LOCAL,
    required: false,
  })
  @IsOptional()
  @IsEnum(AuthProvider)
  provider: AuthProvider;
}
