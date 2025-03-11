import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CompanySigninInput {
  @Field()
  @IsNotEmpty()
  registrationNumber: string;

  @Field()
  @IsNotEmpty()
  password: string;
}
