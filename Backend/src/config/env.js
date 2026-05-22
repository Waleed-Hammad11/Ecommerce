import Joi from 'joi';

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000),

  MONGO_URI: Joi.string().required(),

  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EMAIL_SECRET: Joi.string().min(32).required(),

  BACKEND_URL: Joi.string().uri().default('http://localhost:3000'),
  FRONTEND_URL: Joi.string().uri().default('http://localhost:4200'),

  SMTP_USER: Joi.string().email().required(),
  SMTP_PASS: Joi.string().required(),
})
  .unknown()
  .required();

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Environment validation failed:\n${error.message}`);
}

export const env = {
  nodeEnv: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoUri: envVars.MONGO_URI,
  jwtSecret: envVars.JWT_SECRET,
  jwtEmailSecret: envVars.JWT_EMAIL_SECRET,
  backendUrl: envVars.BACKEND_URL,
  frontendUrl: envVars.FRONTEND_URL,
  smtp: {
    user: envVars.SMTP_USER,
    pass: envVars.SMTP_PASS,
  },
  isDev: envVars.NODE_ENV === 'development',
  isProd: envVars.NODE_ENV === 'production',
  isTest: envVars.NODE_ENV === 'test',
};
