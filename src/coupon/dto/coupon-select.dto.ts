import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CouponSelectDto {
  @Field()
  @IsNotEmpty()
  restaurantId: number;
}
