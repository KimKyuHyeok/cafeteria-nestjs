import { PrismaService } from 'nestjs-prisma';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CouponChargeDto } from './dto/coupon-charge.dto';
import { Coupon } from './model/coupon.model';
import { CouponUseDto } from './dto/coupon-use.dto';
import { CouponResponse } from './dto/coupon.response';
import { CouponSelectDto } from './dto/coupon-select.dto';
import { RestaurantWithCouponsDto } from './dto/restaurant-with-coupon.dto';

@Injectable()
export class CouponService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async couponsFindByCompanyId(company: any): Promise<RestaurantWithCouponsDto[]> {

        try {
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
                coupon: restaurant.coupon.reduce((acc, curr) => {
                  const existing = acc.find((item) => item.restaurantId === curr.restaurantId);
                  if (existing) {
                    existing.count += curr.count; // count 합산
                  } else {
                    acc.push({ ...curr });
                  }
                  return acc;
                }, [] as { id: number; restaurantId: number; companyId: number; count: number }[]),
              }));

            return result;
        } catch (error) {
            console.error(error);
        }
    }

    // 잔여 쿠폰 확인
    async couponSelectByCompanyId(company: any, data: CouponSelectDto): Promise<Number> {
        
        try {
            const coupons = await this.prisma.coupon.findMany({
                where: {
                    companyId: company.id,
                    restaurantId: data.restaurantId,
                },
                select: {
                    count: true,
                },
            });
        
            const totalCount = coupons.reduce((sum, coupon) => sum + (coupon.count || 0), 0);
        
            return totalCount;
        } catch (error) {
            throw new BadRequestException(error);
        }
    }
    
    // 쿠폰 충전
    async couponCharge(data: CouponChargeDto, company: any): Promise<Coupon> {
        
        try {
            if (company.id !== data.companyId) throw new ForbiddenException('권한이 없습니다.');

            return await this.prisma.coupon.create({
                data: data
            })
        } catch (error) {
            throw new BadRequestException('에러가 발생하였습니다 : ', error);
        }
    }

    // 잔여 쿠폰 확인 후 차감
    async couponUse(data: CouponUseDto, user: any): Promise<CouponResponse> {

        try {
            const companyUser = await this.prisma.companyUser.findFirst({
                where: {
                    companyId: data.companyId,
                    userId: user.id,
                    status: 'APPROVED'
                }
            })

            if (companyUser === null || companyUser === undefined ) throw new ForbiddenException('현재 소속된 기업이 존재하지 않습니다.');

            const coupon = await this.prisma.coupon.findFirst({
                where: {
                    companyId: data.companyId,
                    restaurantId: data.restaurantId
                }
            })

            if (coupon.count < 1) throw new NotFoundException('잔여 식권 수량이 부족합니다.');
            
            await this.prisma.coupon.update({
                where: { id: coupon.id },
                data: { count: coupon.count - 1 }
            })

            await this.prisma.usageHistory.create({
                data: {
                    coupon: { connect: { id: coupon.id }},
                    restaurant: { connect: { id: data.restaurantId }},
                    user: { connect: { id: data.userId }}
                }
            })

            return {
                success: true,
                message: '식권 사용이 완료되었습니다.'
            }
        } catch (error) {
            return {
                success: false,
                message: error
            }
        }
    }


}
