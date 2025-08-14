import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RefreshDto {
  @ApiProperty({example: "your-jwt-refresh-token", description: "This verify the refresh token and generate a pair of tokens"})
  @IsString()
  @IsNotEmpty()
  token: string;
}