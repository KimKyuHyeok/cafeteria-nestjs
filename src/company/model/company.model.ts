import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { BaseModel } from 'src/common/models/base.model';

@ObjectType()
export class Company extends BaseModel {

  @Field(() => String)
  @IsNotEmpty()
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  companyName: string;

  @Field(() => String)
  @IsNotEmpty()
  password: string;

  @Field(() => String)
  @IsNotEmpty()
  registrationNumber: string;

  @Field(() => String)
  @IsNotEmpty()
  manager: string;
}
