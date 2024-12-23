import { ObjectType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";
import { BaseModel } from "src/common/models/base.model";

@ObjectType()
export class User extends BaseModel {

    @IsNotEmpty()
    companyId: number;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    phoneNumber: string;
    
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;
}