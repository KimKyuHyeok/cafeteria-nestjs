import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, MinLength } from "class-validator";


@InputType()
export class CompanySignupInput {
    @Field(() => String)
    @IsNotEmpty()
    name: string;

    @Field(() => String)
    @IsNotEmpty()
    @MinLength(8)
    password: string;

    @Field(() => String)
    @IsNotEmpty()
    registrationNumber: string;

    @Field(() => String)
    @IsNotEmpty()
    manager: string;
}