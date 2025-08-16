import { MailOptions } from './mail-options.interface';

export interface ConfirmationOptions extends MailOptions {
  endpoint: string;
}
