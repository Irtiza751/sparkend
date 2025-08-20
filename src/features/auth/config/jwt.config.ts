import { registerAs } from '@nestjs/config';

export default registerAs('jwtConfig', () => ({
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtAccessExpiresIn: process.env.JWT_ACCESS_TTL,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_TTL,
  jwtIssuer: process.env.JWT_ISSUER,
  jwtAudience: process.env.JWT_AUDIENCE,
  jwtVerificationSecret: process.env.JWT_VERIFICATION_SECRET,
  // google signin configs
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL || '',
}));
