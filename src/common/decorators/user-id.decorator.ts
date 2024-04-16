import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { REQUEST_USER_KEY } from 'src/authentication/constant/user.constant';


export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const user = request[REQUEST_USER_KEY];

    return user?.sub;
  },
);
