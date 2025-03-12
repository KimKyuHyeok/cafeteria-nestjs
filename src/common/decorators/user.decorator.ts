import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const UserEntity = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const user = GqlExecutionContext.create(ctx).getContext().req.user;
    return user;
  },
);
