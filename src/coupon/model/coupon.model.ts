import { Field, ObjectType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";
import { BaseModel } from "src/common/models/base.model";

@ObjectType()
export class Coupon extends BaseModel {
    @Field()
    @IsNotEmpty()
    companyId: number;

    @Field()
    @IsNotEmpty()
    restaurantId: number;

    @Field()
    @IsNotEmpty()
    paymentsId: number;

    @Field()
    @IsNotEmpty()
    count: number;
}