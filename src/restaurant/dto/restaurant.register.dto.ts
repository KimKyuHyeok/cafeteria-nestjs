import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class RestaurantRegisterDto {

    @Field()
    @IsNotEmpty()
    name: string;

    @Field()
    @IsNotEmpty()
    address: string;

    @Field()
    @IsNotEmpty()
    price: number;
}