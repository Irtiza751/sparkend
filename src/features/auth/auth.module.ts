import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleController } from './social/google.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigType } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { UserModule } from '../../features/user/user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MailModule } from '../mail/mail.module';
import { GoogleProvider } from './provider/google-provider';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  controllers: [AuthController, GoogleController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    GoogleProvider,
  ],
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
    ConfigModule.forFeature(jwtConfig),
    MailModule,
  ],
})
export class AuthModule {}
