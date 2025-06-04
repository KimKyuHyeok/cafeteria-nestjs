import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { SendMessageInput } from './input/send.message.input';
import { CustomSocket } from 'src/common/type/custom-socket';

@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: '*',
  }
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: CustomSocket) {
    try {
      const companyId = client.user?.companyId || client.company?.companyId;
  
      if (!companyId) {
        client.disconnect();
        return;
      }
  
      const roomId = `company-${companyId}`;
      client.join(roomId);
  
      const messages = await this.chatService.selectMessages(roomId);
      client.emit('previousMessages', messages);
    } catch (error) {
      console.error(error)
    }
  }

  handleDisconnect(client: Socket) {
      
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: SendMessageInput,
    @ConnectedSocket() client: CustomSocket
  ) {
    const message = await this.chatService.saveMessage(data);

    this.server.to(data.roomId).emit('newMessage', message);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: CustomSocket,
    @MessageBody() roomId: string
  ) {
    const companyId = this.extractCompanyIdFromRoom(roomId);
  
    const isAuthorized = await this.isClientAuthorizedForRoom(client, companyId);
    if (!isAuthorized) {
      client.emit('error', '접근 권한이 없습니다.');
      return;
    }
  
    client.join(roomId);
    const messages = await this.chatService.selectMessages(roomId);
    client.emit('previousMessages', messages);
  }
  
  private extractCompanyIdFromRoom(roomId: string): number {
    return Number(roomId.split('-')[1]);
  }
  
  private async isClientAuthorizedForRoom(client: CustomSocket, companyId: number): Promise<boolean> {
    if (client.user) {
      return await this.chatService.isUserInCompany(client.user.userId, companyId);
    }
  
    if (client.company) {
      return client.company.companyId === companyId;
    }
  
    return false;
  }
}
