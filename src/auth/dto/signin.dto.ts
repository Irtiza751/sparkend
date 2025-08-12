import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SigninDto {
  @ApiProperty({ example: 'johndoe', description: 'Username or Password' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: '******' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
