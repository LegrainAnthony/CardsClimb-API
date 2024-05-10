import { HttpException } from '@nestjs/common';

const INVALID_TOKEN_STATUS = 498;

export class InvalidTokenException extends HttpException {
  constructor(message?: string) {
    super(message || 'Invalid Token', INVALID_TOKEN_STATUS);
  }
}
