import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  audience: process.env.JWT_TOKEN_AUDIENCE,
  issuer: process.env.JWT_TOKEN_ISSUER,
  accessTokenTtl: parseInt(process.env.JWT_EXPIRATION ?? '3600', 10),
  refreshTokenTtl: parseInt(
    process.env.JWT_REFRESH_TOKEN_EXPIRATION ?? '86400',
    10,
  ),
}));
