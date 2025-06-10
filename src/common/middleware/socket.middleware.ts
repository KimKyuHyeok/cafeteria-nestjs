import { JwtService } from '@nestjs/jwt';
import { ChatService } from 'src/chat/chat.service';
import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

export function createSocketMiddleware(
	jwtService: JwtService,
	chatService: ChatService,
) {
	return async (socket: Socket & { user?: any; company?: any }, next: (err?: any) => void) => {
	const { userToken, companyToken } = socket.handshake.auth.token || {};

	try {
		if (userToken) {
			const payload = jwtService.verify(userToken);
			const companyUser = await chatService.companyUserFindByUserId(payload);
			socket.user = companyUser;
		} else if (companyToken) {
			const payload = jwtService.verify(companyToken);
			socket.company = payload;
		} else {
			return next(new Error('No token provided'));
		}

		next();
    } catch (err) {
		console.error('socket middleware error : ', err);
      	return next(new Error('Invalid token'));
    }
  };
}
