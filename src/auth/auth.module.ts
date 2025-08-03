import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleController } from './social/google.controller';

@Module({
  controllers: [AuthController, GoogleController],
  providers: [AuthService],
})
export class AuthModule {}
