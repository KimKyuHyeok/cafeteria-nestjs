import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CompanyUserJoinRequestDto {
  @Field()
  companyId: number;
}
