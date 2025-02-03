import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class QrDataDto {
    @Field()
    @IsNotEmpty()
    restaurantId: number;

    @Field()
    @IsNotEmpty()
    companyId: number;

    @Field()
    @IsNotEmpty()
    userId: number;
}