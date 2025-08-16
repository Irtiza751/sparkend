import { MailOptions } from './mail-options.interface';

export interface ResetMailOptions extends MailOptions {
  endpoint: string;
}
