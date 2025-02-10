import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class QrDataDto {
    @Field()
    @IsNotEmpty()
    couponId: number;
}