import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateRoleDto {
  @IsString()
  @ApiProperty({
    description: 'The name of the role',
    example: 'Admin',
  })
  name: string;
}
