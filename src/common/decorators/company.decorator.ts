import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const CompanyEntity = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
      const company = GqlExecutionContext.create(ctx).getContext().req;
      return company;
    }
  );
  