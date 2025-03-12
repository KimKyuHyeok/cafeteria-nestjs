import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';
import { Payments } from './model/payments.model';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async selectPayments(id: number): Promise<Payments[]> {
    try {
      return await this.prisma.payments.findMany({
        where: {
          companyId: id,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
}
