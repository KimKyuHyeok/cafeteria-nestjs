import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class CompanyUserResponse {

    @Field()
    success: boolean;

    @Field()
    message: string;
}