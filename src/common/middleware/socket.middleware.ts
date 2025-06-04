import { Injectable, NestMiddleware, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Socket } from "socket.io";
import { CustomSocket } from "../type/custom-socket";
import { ChatService } from "src/chat/chat.service";

@Injectable()
export class SocketMiddleware implements NestMiddleware {
    constructor(
        private jwtService: JwtService,
        private chatService: ChatService
    ) {}

    async use(socket: Socket & { user?: any }, next: (err?: any) => void) {
        const client = socket as CustomSocket;
        const { userToken, companyToken } = socket.handshake.auth.token;

        try {
            if (userToken) {
                const payload = this.jwtService.verify(userToken);
                const companyUser = await this.chatService.companyUserFindByUserId(payload.sub);
                client.user = companyUser;
            } else if (companyToken) {
                const payload = this.jwtService.verify(companyToken);
                client.company = payload;
            } else {
                return next(new Error('No token provided'));
            }

            next();
        } catch (error) {
            return next(new Error('Invalid token'))
        }
    }
}