import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Users } from 'src/users/entities/user.entity';
import { AuthRequest } from '../models/authRequest';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): Users => {
    const req = context.switchToHttp().getRequest<AuthRequest>();
    return req.user;
  },
);
