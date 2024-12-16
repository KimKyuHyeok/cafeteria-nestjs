import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class CompanyJoinRequestDto {

    @Field()
    @IsNotEmpty()
    userId: number;

    @Field()
    @IsNotEmpty()
    name: string

    @Field()
    @IsNotEmpty()
    email: string;
}