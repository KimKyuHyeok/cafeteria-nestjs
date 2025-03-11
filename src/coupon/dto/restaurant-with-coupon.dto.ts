import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ObjectType()
export class RestaurantWithCouponsDto {
  @Field()
  @IsNotEmpty()
  id: number;

  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  address: string;

  @Field(() => [CouponDto])
  coupon: CouponDto[];
}

@ObjectType()
class CouponDto {
  @Field()
  count: number;

  @Field()
  @IsNotEmpty()
  restaurantId: number;

  @Field()
  @IsNotEmpty()
  companyId: number;
}
