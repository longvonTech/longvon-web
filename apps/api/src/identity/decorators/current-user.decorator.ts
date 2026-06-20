import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AppJwtPayload } from '../jwt-payload.types';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): AppJwtPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
