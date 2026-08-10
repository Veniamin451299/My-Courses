// path: backend/src/config/env.js
const Joi = require('joi');

const schema = Joi.object({
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  DATABASE_URL: Joi.string().required(),
  REDIS_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().min(32).required(),
  HASHID_SALT: Joi.string().min(10).required(),
  ADMIN_EMAIL: Joi.string().email().required(),
  ADMIN_PASSWORD: Joi.string().min(8).required(),
}).unknown();

const { error, value } = schema.validate(process.env);

if (error) throw new Error(`Environment validation error: ${error.message}`);

module.exports = {
  port: value.PORT,
  nodeEnv: value.NODE_ENV,
  databaseUrl: value.DATABASE_URL,
  redisUrl: value.REDIS_URL,
  jwtSecret: value.JWT_SECRET,
  hashidSalt: value.HASHID_SALT,
  adminEmail: value.ADMIN_EMAIL,
  adminPassword: value.ADMIN_PASSWORD,
};