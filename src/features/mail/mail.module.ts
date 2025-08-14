import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import mailConfig from './config/mail.config';
import { join } from 'path';

const templatesDir = join(process.cwd(), 'src/features/mail/templates');

console.log('template path: ', templatesDir);
@Module({
  imports: [
    ConfigModule.forFeature(mailConfig),
    MailerModule.forRootAsync({
      imports: [ConfigModule.forFeature(mailConfig)],
      inject: [mailConfig.KEY],
      useFactory: (config: ConfigType<typeof mailConfig>) => ({
        transport: {
          host: config.host,
          port: config.port,
          secure: config.secure,
          auth: {
            user: config.user,
            pass: config.password,
          },
        },
        defaults: {
          from: config.from,
        },
        template: {
          dir: templatesDir,
          adapter: new HandlebarsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
