import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const StoreEntity = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
      const store = GqlExecutionContext.create(ctx).getContext().req.user;
      return store;
    }
  );
  