import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { SendMessageInput } from './input/send.message.input';

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) {}

    async saveMessage(data: SendMessageInput) {
        return await this.prisma.chatMessage.create({
            data
        })
    }

    async selectMessages(roomId: string) {
        const messages =  await this.prisma.chatMessage.findMany({
            where: { roomId },
            orderBy: {
                createdAt: 'asc'
            }
        })

        const enhancedMessages = await Promise.all(
            messages.map(async (msg) => {
                let senderName = '';
                if (msg.senderType === 'User') {
                    const user = await this.prisma.user.findUnique({
                        where: { id: msg.senderId }
                    })
                    senderName = user?.name ?? ''
                } else if (msg.senderType === 'Company') {
                    const company = await this.prisma.company.findUnique({
                        where: { id: msg.senderId }
                    })
                    senderName = company?.companyName ?? '';
                }
                return {
                    ...msg,
                    senderName,
                }
            })
        )

        return enhancedMessages;
    }

    async companyUserFindByUserId(data: { userId: number, name: string}) {
        try {
            return await this.prisma.companyUser.findFirst({
                where: { userId: data.userId }
            })
        } catch (error) {
            console.error('companyUserFindByUserId error: ', error);
            throw new NotFoundException('가입된 기업 정보를 찾을 수 없습니다.');
        }
    }

    async isUserInCompany(userId: number, companyId: number): Promise<boolean> {
        const record = await this.prisma.companyUser.findFirst({
            where: {
                userId,
                companyId
            }
        });
        return !!record;
    }

    async companyNameFindById(companyId: number) {
        return this.prisma.company.findUnique({
            where: { id: companyId },
            select: { companyName: true }
        })
    }

    async userNameFindById(userId: number) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            select: { name: true }
        })
    }
}