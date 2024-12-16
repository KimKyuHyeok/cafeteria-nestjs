import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class CompanyJoinResponse {

    @Field()
    success: boolean;

    @Field()
    message: string;

    @Field()
    errorMessage?: string;
}