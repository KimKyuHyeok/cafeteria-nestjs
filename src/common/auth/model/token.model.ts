import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLJWT } from 'graphql-scalars';

@ObjectType()
export class Token {
  @Field(() => GraphQLJWT, { description: 'access token' })
  accessToken: string;

  @Field(() => GraphQLJWT, { description: 'refresh token' })
  refreshToken: string;
}
