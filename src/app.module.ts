import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './features/auth/auth.module';
import { JwtAuthGuard } from './features/auth/guards/jwt-auth.guard';
import appConfig from './config/app.config';
import { DatabaseConfig } from './config/database.config';
import validateEnv from './config/validate.env';
import { UserModule } from './features/user/user.module';
import { MailModule } from './features/mail/mail.module';
import { CommonModule } from './common/common.module';
import { StorageModule } from './core/storage.module';
import { StorageModule } from './core/storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validationSchema: validateEnv,
      load: [appConfig],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    MikroOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
    AuthModule,
    UserModule,
    MailModule,
    CommonModule,
    StorageModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
