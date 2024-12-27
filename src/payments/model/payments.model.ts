import { Field, ObjectType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";
import { BaseModel } from "src/common/models/base.model";

@ObjectType()
export class Payments extends BaseModel {
    @Field()
    @IsNotEmpty()
    companyId: number;

    @Field()
    @IsNotEmpty()
    orderId: string;

    @Field()
    @IsNotEmpty()
    amount: number;

    @Field()
    @IsNotEmpty()
    paymentMethod: string;

    @Field()
    @IsNotEmpty()
    paymentStatus: string;

    @Field()
    @IsNotEmpty()
    transactionId: string;

    @Field()
    paymentDate?: Date;
}