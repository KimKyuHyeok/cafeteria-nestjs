import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class CouponUseDto {
    @Field()
    @IsNotEmpty()
    companyId: number;

    @Field()
    @IsNotEmpty()
    userId: number;

    @Field()
    @IsNotEmpty()
    restaurantId: number;
}