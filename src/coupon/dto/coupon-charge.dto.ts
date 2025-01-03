import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class CouponChargeDto {
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