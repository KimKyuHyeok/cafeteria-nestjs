import { Field, ObjectType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";
import { BaseModel } from "src/common/models/base.model";

@ObjectType()
export class UsageHistory extends BaseModel {
    @Field()
    @IsNotEmpty()
    couponId: number;

    @Field()
    @IsNotEmpty()
    restaurantId: number;
    
    @Field()
    @IsNotEmpty()
    userId: number;
}