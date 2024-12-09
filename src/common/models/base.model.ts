import { Field, HideField, ID, ObjectType } from "@nestjs/graphql";

@ObjectType({ isAbstract: true })
export abstract class BaseModel {
    @Field(() => ID, { nullable: true, description: '고유 아이디'})
    @HideField()
    id: number;

    @Field({
        nullable: true,
        description: '생성일'
    })
    createdAt: Date;

    @Field({
        nullable: true,
        description: '수정일'
    })
    updatedAt: Date;
}