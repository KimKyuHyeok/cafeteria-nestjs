import { PrismaService } from 'nestjs-prisma';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CouponChargeDto } from './dto/coupon-charge.dto';
import { Coupon } from './model/coupon.model';
import { CouponUseDto } from './dto/coupon-use.dto';
import { CouponSelectDto } from './dto/coupon-select.dto';
import { RestaurantWithCouponsDto } from './dto/restaurant-with-coupon.dto';
import QRCode from 'qrcode';
import { QRCodeResponseDto } from './dto/qrcode-response.dto';
import { QrDataDto } from './dto/qrcode-data.dto';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { Status } from '@prisma/client';

@Injectable()
export class CouponService {
  constructor(private readonly prisma: PrismaService) {}

  async couponsFindByCompanyId(
    company: any,
  ): Promise<RestaurantWithCouponsDto[]> {

    const restaurantsWithCoupons = await this.prisma.restaurant.findMany({
      where: {
        coupon: {
          some: {
            companyId: company.id,
            count: {
              gte: 1,
            },
          },
        },
      },
      include: {
        coupon: {
          where: {
            companyId: company.id,
            count: {
              gte: 1,
            },
          },
          select: {
            id: true,
            restaurantId: true,
            companyId: true,
            count: true,
          },
        },
      },
    });

    const result = restaurantsWithCoupons.map((restaurant) => ({
      id: restaurant.id,
      name: restaurant.name,
      address: restaurant.address,
      coupon: restaurant.coupon.reduce(
        (acc, curr) => {
          const existing = acc.find(
            (item) => item.restaurantId === curr.restaurantId,
          );
          if (existing) {
            existing.count += curr.count; // count 합산
          } else {
            acc.push({ ...curr });
          }
          return acc;
        },
        [] as {
          id: number;
          restaurantId: number;
          companyId: number;
          count: number;
        }[],
      ),
    }));

    return result;

  }

  async couponsFindByUserId(user: any): Promise<RestaurantWithCouponsDto[]> {

    const companyUser = await this.prisma.companyUser.findFirst({
      where: { userId: user.id },
    });
    const restaurantsWithCoupons = await this.prisma.restaurant.findMany({
      where: {
        coupon: {
          some: {
            companyId: companyUser.companyId,
            count: {
              gte: 1,
            },
          },
        },
      },
      include: {
        coupon: {
          where: {
            companyId: companyUser.companyId,
            count: {
              gte: 1,
            },
          },
          select: {
            id: true,
            restaurantId: true,
            companyId: true,
            count: true,
          },
        },
      },
    });

    const result = restaurantsWithCoupons.map((restaurant) => ({
      id: restaurant.id,
      name: restaurant.name,
      address: restaurant.address,
      coupon: restaurant.coupon.reduce(
        (acc, curr) => {
          const existing = acc.find(
            (item) => item.restaurantId === curr.restaurantId,
          );
          if (existing) {
            existing.count += curr.count; // count 합산
          } else {
            acc.push({ ...curr });
          }
          return acc;
        },
        [] as {
          id: number;
          restaurantId: number;
          companyId: number;
          count: number;
        }[],
      ),
    }));

    return result;

  }

  // 잔여 쿠폰 확인
  async couponSelectByCompanyId(
    company: any,
    data: CouponSelectDto,
  ): Promise<number> {

    const coupons = await this.prisma.coupon.findMany({
      where: {
        companyId: company.id,
        restaurantId: data.restaurantId,
      },
      select: {
        count: true,
      },
    });

    const totalCount = coupons.reduce(
      (sum, coupon) => sum + (coupon.count || 0),
      0,
    );

    return totalCount;
  }

  // 쿠폰 충전
  async couponCharge(data: CouponChargeDto, company: any): Promise<Coupon> {

    if (company.id !== data.companyId)
    throw new ForbiddenException('권한이 없습니다.');

    return await this.prisma.coupon.create({
      data: data,
    });
  }

  // 잔여 쿠폰 확인 후 차감
  async couponUse(data: QrDataDto, user: any): Promise<BaseResponseDto> {

    const coupon = await this.prisma.coupon.findFirst({
      where: {
        id: data.couponId,
      },
    });

    const existingCompanyUser = await this.prisma.companyUser.findFirst({
      where: {
        companyId: coupon.companyId,
        userId: user.id,
        status: Status.APPROVED
      }
    })

    if (!existingCompanyUser) throw new UnauthorizedException('현재 소속된 기업이 존재하지 않습니다.')

    if (coupon.count < 1)
      throw new NotFoundException('잔여 식권 수량이 부족합니다.');

    await this.prisma.coupon.update({
      where: { id: coupon.id },
      data: { count: coupon.count - 1 },
    });

    await this.prisma.usageHistory.create({
        data: {
            coupon: { connect: { id: coupon.id }},
            restaurant: { connect: { id: coupon.restaurantId }},
            user: { connect: { id: user.id }}
        }
    })

    return {
      success: true,
      message: '식권 사용이 완료되었습니다.',
    };
  }

  async generateQrCode(
    user: any,
    data: CouponUseDto,
  ): Promise<QRCodeResponseDto> {
    const companyUser = await this.prisma.companyUser.findFirst({
      where: {
        userId: user.id,
        companyId: data.companyId,
      },
    });

    if (!companyUser) throw new ForbiddenException('권한이 없습니다.');

    const count = await this.prisma.coupon.findFirst({
      where: {
        companyId: data.companyId,
        restaurantId: data.restaurantId,
        count: { gte: 1 },
      },
    });

    if (!count) throw new NotFoundException('쿠폰 잔여 수량이 부족합니다.');

    const qrData = JSON.stringify({
      couponId: count.id,
      userId: user.id,
      restaurantId: data.restaurantId,
    });
    const qrCode = await QRCode.toDataURL(qrData);
    const response = new QRCodeResponseDto();
    response.url = qrCode;

    return response;

  }
}
