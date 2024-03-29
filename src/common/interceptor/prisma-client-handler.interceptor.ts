import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { Observable, catchError, throwError } from "rxjs";

@Injectable()
export class prismaClientHandler implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(catchError((err): Observable<any> => {
            if(err instanceof Prisma.PrismaClientKnownRequestError) {
                return throwError(() => new BadRequestException());
            }
            return throwError(() => err);
        }));
    }
}