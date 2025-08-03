import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { DatabaseConfig } from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import appConfig from './config/app.config';
import validateEnv from './config/validate.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validationSchema: validateEnv,
      load: [
        appConfig,
      ]
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
