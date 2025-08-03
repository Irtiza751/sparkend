import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000'),
}));
