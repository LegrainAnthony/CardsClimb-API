import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  secret: process.env.JWT_SECRET,
  audience: process.env.JWT_TOKEN_AUDIENCE,
  issuer: process.env.JWT_TOKEN_ISSUER,
  accessTokenTtl: parseInt(process.env.JWT_EXPIRATION ?? '3600', 10),
  refreshTokenTtl: parseInt(
    process.env.JWT_REFRESH_TOKEN_EXPIRATION ?? '86400',
    10,
  ),
  database: {
    url: process.env.DATABASE_URL,
    test: {
      name: process.env.POSTGRES_DB_TEST,
      user: process.env.POSTGRES_USER_TEST,
      password: process.env.POSTGRES_PASSWORD,
    },
    production: {
      name: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    },
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
    db: parseInt(process.env.REDIS_DB ?? '0', 10),
  },
  pgAdminDefaultEmail: process.env.PGADMIN_DEFAULT_EMAIL,
  pgAdminDefaultPassword: process.env.PGADMIN_DEFAULT_PASSWORD,
}));
