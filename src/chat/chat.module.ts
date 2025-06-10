import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CustomSocketIoAdapter } from 'src/common/adapter/websocket.adapter';

@Module({
  imports: [JwtModule.register({ secret: process.env.JWT_ACCESS_SECRET })],
  providers: [ChatGateway, ChatService, CustomSocketIoAdapter],
  exports: [CustomSocketIoAdapter]
})
export class ChatModule {}
