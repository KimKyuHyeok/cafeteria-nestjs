import { Field, InputType, Int } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class CompanySearchInput {
    @Field()
    @IsNotEmpty()
    keyword: string;

    @Field(() => Int)
    @IsNotEmpty()
    skip: number;

    @Field(() => Int)
    @IsNotEmpty()
    take: number;
}