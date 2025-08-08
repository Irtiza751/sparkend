import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleController } from './social/google.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigType } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  controllers: [AuthController, GoogleController],
  providers: [AuthService],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(jwtConfig)],
      inject: [jwtConfig.KEY],
      useFactory: (jwtConfigService: ConfigType<typeof jwtConfig>) => ({
        secret: jwtConfigService.jwtAccessSecret,
        signOptions: {
          expiresIn: jwtConfigService.jwtAccessExpiresIn,
          issuer: jwtConfigService.jwtIssuer,
          audience: jwtConfigService.jwtAudience,
        },
      }),
    }),
    UserModule,
    LocalStrategy
  ],
})
export class AuthModule {}
