import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class parseBigIntInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.transformResponse(data)));
  }

  transformResponse(data: any) {
    const replacer = (key, value) =>
      typeof value === 'bigint' ? value.toString() : value;
    return JSON.parse(JSON.stringify(data, replacer));
  }
}
