import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { BaseModel } from 'src/common/models/base.model';

@ObjectType()
export class Store extends BaseModel {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  password: string;

  @Field()
  restaurantId?: number;
}
