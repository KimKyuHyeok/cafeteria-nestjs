import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BaseResponseDto {
  @Field()
  success: boolean;

  @Field()
  message: string;
}
