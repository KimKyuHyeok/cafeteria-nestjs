import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ObjectType()
export class userWithCompanyDto {
  @Field()
  @IsNotEmpty()
  id: number;

  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  phoneNumber?: string;

  @Field()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsNotEmpty()
  status: string;

  @Field()
  @IsNotEmpty()
  companyUserId: number;

  @Field()
  @IsNotEmpty()
  createdAt: Date;

  @Field()
  updatedAt?: Date;
}
