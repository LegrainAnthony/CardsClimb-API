import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class prismaClientHandler implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      catchError((err): Observable<unknown> => {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          throw new BadRequestException('Invalid data provided');
        }

        if (err instanceof Prisma.PrismaClientValidationError) {
          throw new BadRequestException('Invalid data provided');
        }

        return throwError(() => err);
      }),
    );
  }
}
