import { MailerService } from '@nestjs-modules/mailer';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { SentMessageInfo } from 'nodemailer';

@Injectable()
export class MailService {
  constructor(
    /**
     * @description mailer server to send emails
     */
    private readonly mailerService: MailerService,
  ) {}

  send(user: { email: string }): Promise<SentMessageInfo> {
    return this.mailerService.sendMail({
      to: user.email,
      subject: 'Test subject for email',
      template: './welcome',
      context: {
        name: 'Irtiza',
      },
    });
  }
}
