import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UserInfoUpdateInput {
    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    password?: string;

    @Field({ nullable: true })
    phoneNumber?: string;
}