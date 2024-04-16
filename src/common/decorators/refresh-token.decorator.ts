import { SetMetadata } from '@nestjs/common';

export const REFRESH_TOKEN_KEY = 'refresh';
export const RefreshToken = () => SetMetadata(REFRESH_TOKEN_KEY, true);
