import {
  INestApplication,
    INestApplicationContext,
    WebSocketAdapter,
  } from '@nestjs/common';
  import { Server, ServerOptions, Socket } from 'socket.io';
  import { MessageMappingProperties } from '@nestjs/websockets';
  import { fromEvent, Observable } from 'rxjs';
  import { mergeMap } from 'rxjs/operators';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from 'src/chat/chat.service';
import { createSocketMiddleware } from '../middleware/socket.middleware';
  
  export class CustomSocketIoAdapter implements WebSocketAdapter {
    private server: Server;
  
    constructor(private app: INestApplication) {}
  
    create(port: number, options?: ServerOptions): Server {

      if (this.server) {
        return this.server
      }

      const jwtService = this.app.get(JwtService);
      const chatService = this.app.get(ChatService);
      const middleware = createSocketMiddleware(jwtService, chatService)


      this.server = new Server(this.app.getHttpServer(), {
        cors: {
          origin: "*",
        },
        transports: ["websocket"]
      })

      
      this.server.use(middleware);

      return this.server;
    }
  
    bindClientConnect(server: Server, callback: (client: Socket) => void): void {
      server.on('connection', callback);
    }
  
    bindMessageHandlers(
      client: Socket,
      handlers: MessageMappingProperties[],
      transform: (data: any) => Observable<any>,
    ) {
      handlers.forEach(({ message, callback }) => {
        fromEvent(client, message)
          .pipe(mergeMap((data) => transform(callback(data))))
          .subscribe((response) => {
            if (response) {
              client.emit('message', response);
            }
          });
      });
    }
  
    close(server: Server): void {
      server.close();
    }
  }
  