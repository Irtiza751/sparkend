import * as Joi from 'joi';

export default Joi.object({
  // app configs
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  PORT: Joi.number().default(4000),
  FRONTEND_URL: Joi.string().required(),
  APP_NAME: Joi.string().optional().default('Sparkend'),
  // database configs
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  // jwt configs
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_ISSUER: Joi.string().required(),
  JWT_AUDIENCE: Joi.string().required(),
  JWT_ACCESS_TTL: Joi.string().required(),
  JWT_REFRESH_TTL: Joi.string().required(),
  JWT_VERIFICATION_SECRET: Joi.string().required(),
  // social signin config
  GOOGLE_CLIENT_ID: Joi.string().optional().default('your-client-id'),
  GOOGLE_CLIENT_SECRET: Joi.string().optional().default('your-client-secret'),
  GOOGLE_CALLBACK_URL: Joi.string().optional().default('your-callback-url'),
  // mail config
  MAIL_HOST: Joi.string().required(),
  MAIL_PORT: Joi.number().optional().default(587),
  MAIL_SECURE: Joi.boolean().optional().default(false),
  MAIL_USER: Joi.string().required(),
  MAIL_PASS: Joi.string().required(),
  MAIL_FROM: Joi.string().optional().default('<noreply@your-app.com>'),
});
