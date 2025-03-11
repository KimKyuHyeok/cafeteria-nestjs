import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UserSignupInput {
  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => String)
  @IsNotEmpty()
  phoneNumber: string;

  @Field(() => String)
  @IsNotEmpty()
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  password: string;
}
