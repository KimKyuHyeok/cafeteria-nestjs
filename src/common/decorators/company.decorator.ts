import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const CompanyEntity = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => 
    GqlExecutionContext.create(ctx).getContext().req.company
)