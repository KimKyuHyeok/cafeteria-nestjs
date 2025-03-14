import { Field, ObjectType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@ObjectType()
export class CompanySearchDto {

    @Field(() => [CompanyDto])
    companies: CompanyDto[];

    @Field()
    totalCount: number;
}


@ObjectType()
export class CompanyDto {
    @Field()
    @IsNotEmpty()
    id: number;

    @Field()
    @IsNotEmpty()
    registrationNumber: string;

    @Field()
    @IsNotEmpty()
    companyName: string;

}