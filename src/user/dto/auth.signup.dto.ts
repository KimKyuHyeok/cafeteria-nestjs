import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class AuthSignupDto {
    @Field()
    name: string;

    @Field()
    email: string;

    @Field()
    phoneNumber: string;

    @Field()
    username: string;
}