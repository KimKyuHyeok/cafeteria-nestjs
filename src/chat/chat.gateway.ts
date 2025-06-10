import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { SendMessageInput } from './input/send.message.input';
import { CustomSocket } from 'src/common/type/custom-socket';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket']
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: CustomSocket) {
    try {
      console.log("Connect : ", client.company);
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
    @MessageBody() data: string,
    @ConnectedSocket() client: CustomSocket
  ) {
    let saveMessage: SendMessageInput = {} as SendMessageInput;

    if (client.company) {
      saveMessage.senderId = client.company.companyId
      saveMessage.senderType = 'Company'
      saveMessage.roomId = `company-${client.company.companyId}`
      saveMessage.content = data
    } else if (client.user) {
      saveMessage.senderId = client.user.userId
      saveMessage.senderType = 'User'
      saveMessage.roomId = `company-${client.user.companyId}`
      saveMessage.content = data
    }
    const message = await this.chatService.saveMessage(saveMessage);

    let senderName: string;
    if (saveMessage.senderType === 'Company') {
      const company = await this.chatService.companyNameFindById(saveMessage.senderId)
      senderName = company?.companyName || '알 수 없음';
    } else {
      const user = await this.chatService.userNameFindById(saveMessage.senderId)
      senderName = user?.name || '알 수 없음';
    }

    this.server.to(saveMessage.roomId).emit('newMessage', {
      ...message,
      senderName
    });
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

  @SubscribeMessage('previousMessages')
  async handlePreviousMessages(
    @ConnectedSocket() client: CustomSocket,
    @MessageBody() roomId: string
  ) {
    const companyId = this.extractCompanyIdFromRoom(roomId);
  
    const isAuthorized = await this.isClientAuthorizedForRoom(client, companyId);
    if (!isAuthorized) {
      client.emit('error', '접근 권한이 없습니다.');
      return;
    }
    
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
