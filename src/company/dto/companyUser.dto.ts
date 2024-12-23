import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class CompanyUserDto {

    @Field()
    @IsNotEmpty()
    id: number;

    @Field()
    @IsNotEmpty()
    userId: number;
}