import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'To let the users change their password if forgoten',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
