import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class StoreSignupInput {
  @Field()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  password: string;
}
