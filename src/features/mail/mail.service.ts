import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import { SentMessageInfo } from 'nodemailer';
import { ResetMailOptions } from './interfaces/reset-mail-options.interface';
import { ConfirmationOptions } from './interfaces/confirmation-options.interface';
import appConfig from '@/config/app.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    /**
     * @description mailer server to send emails
     */
    private readonly mailerService: MailerService,
    /**
     * @description config service
     */
    @Inject(appConfig.KEY)
    private readonly configService: ConfigType<typeof appConfig>,
  ) {}

  async sendConfirmation(
    mailOptions: ConfirmationOptions,
  ): Promise<SentMessageInfo> {
    const { frontendUrl } = this.configService;
    const { endpoint } = mailOptions;
    const url = `${frontendUrl}${endpoint}`;

    return this.mailerService.sendMail({
      to: mailOptions.toEmail,
      subject: 'Test subject for email',
      template: './confirmation',
      context: {
        name: mailOptions.name,
        confirmationLink: url,
        appName: this.configService.appName,
      },
    });
  }

  sendResetEmail(mailOptions: ResetMailOptions) {
    return this.mailerService.sendMail({
      to: mailOptions.toEmail,
      subject: 'Test subject for email',
      template: './forgot-password',
      context: {
        name: mailOptions.name,
        resetLink: mailOptions.restLink,
      },
    });
  }
}
