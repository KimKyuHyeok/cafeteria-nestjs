import { Field, InputType } from "@nestjs/graphql";
import { SenderType } from "@prisma/client";

@InputType()
export class SendMessageInput {
    
    @Field()
    roomId: string;

    @Field()
    senderId: number;

    @Field()
    senderType: SenderType

    @Field()
    content: string;
}