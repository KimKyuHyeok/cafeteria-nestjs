import { Field, ObjectType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@ObjectType()

export class QRCodeResponseDto {
    @Field()
    @IsNotEmpty()
    url: string;
}