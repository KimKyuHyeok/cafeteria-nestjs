import { Field, ObjectType } from "@nestjs/graphql";
import { Status } from "@prisma/client";
import { IsNotEmpty } from "class-validator";


@ObjectType()
export class UserInfo {
    @Field()
    @IsNotEmpty()
    name: string;

    @Field()
    @IsNotEmpty()
    email: string;

    @Field()
    @IsNotEmpty()
    phoneNumber: string;
}

@ObjectType()
export class CompanyUserInfo {

    @Field()
    @IsNotEmpty()
    companyUserId: number;

    @Field()
    @IsNotEmpty()
    companyName: string;

    @Field()
    @IsNotEmpty()
    status: Status;
}

@ObjectType()
export class MyPageInfoDto {
    @Field(() => UserInfo)
    userInfo: UserInfo;

    @Field(() => [CompanyUserInfo])
    companyUserInfo: CompanyUserInfo[];
}


