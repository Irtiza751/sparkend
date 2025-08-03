import { registerAs } from "@nestjs/config";

export default registerAs('jwtCofnig', () => ({
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtAccessExpiresIn: process.env.JWT_ACCESS_TTL,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_TTL,
  jwtIssuer: process.env.JWT_ISSUER,
  jwtAudience: process.env.JWT_AUDIENCE,
}))