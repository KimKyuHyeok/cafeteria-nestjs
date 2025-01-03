import { Field, ObjectType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@ObjectType()
export class CouponResponse {
    @Field()
    @IsNotEmpty()
    success: boolean;

    @Field()
    @IsNotEmpty()
    message: string;
}