import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class AuthResponseDto {
    @Field({ nullable: true })
    accessToken?: string;

    @Field({ nullable: true })
    refreshToken?: string;

    @Field({ nullable: true })
    isRegistered?: boolean;

    @Field({ nullable: true })
    username?: string;
}