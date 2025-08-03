import { ApiProperty } from "@nestjs/swagger";
import { AuthProvider } from "../enums/auth-provider";
import { UserRole } from "../enums/user-role";
import { IsEmail, IsEnum, IsOptional, IsString, IsBoolean, MinLength } from "class-validator";

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

  @ApiProperty({ enum: UserRole, example: UserRole.USER, required: false })
  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ enum: AuthProvider, example: AuthProvider.LOCAL, required: false })
  @IsOptional()
  @IsEnum(AuthProvider)
  provider: AuthProvider;
}
