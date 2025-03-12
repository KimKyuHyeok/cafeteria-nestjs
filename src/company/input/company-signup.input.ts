import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CompanySignupInput {
  @Field(() => String)
  @IsNotEmpty()
  companyName: string;

  @Field(() => String)
  @IsNotEmpty()
  email: string;

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
