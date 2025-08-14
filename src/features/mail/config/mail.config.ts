import { registerAs } from '@nestjs/config';

export default registerAs('mailConfig', () => ({
  port: parseInt(process.env.MAIL_PORT ?? '587'),
  host: process.env.MAIL_HOST ?? '',
  secure: process.env.MAIL_SECURE == 'true',
  user: process.env.MAIL_USER ?? '',
  password: process.env.MAIL_PASS ?? '',
  from: process.env.MAIL_FROM ?? '',
}));
