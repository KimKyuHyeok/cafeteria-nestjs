import { CompanyEntity } from 'src/common/decorators/company.decorator';
import { CouponService } from './coupon.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Coupon } from './model/coupon.model';
import { CouponChargeDto } from './dto/coupon-charge.dto';
import { CouponUseDto } from './dto/coupon-use.dto';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlCompanyAuthGuard } from 'src/company/gql-company-auth.guard';
import { GqlUserAuthGuard } from 'src/company/gql-user-auth.guard';
import { CouponSelectDto } from './dto/coupon-select.dto';
import { RestaurantWithCouponsDto } from './dto/restaurant-with-coupon.dto';
import { QRCodeResponseDto } from './dto/qrcode-response.dto';
import { QrDataDto } from './dto/qrcode-data.dto';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';

@Resolver()
export class CouponResolver {
  constructor(private readonly couponService: CouponService) {}

  @UseGuards(GqlCompanyAuthGuard)
  @Query(() => [RestaurantWithCouponsDto])
  async couponsFindByCompanyId(
    @CompanyEntity() company: any,
  ): Promise<RestaurantWithCouponsDto[]> {
    return await this.couponService.couponsFindByCompanyId(company);
  }

  @UseGuards(GqlUserAuthGuard)
  @Query(() => [RestaurantWithCouponsDto])
  async couponsFindByUserId(
    @UserEntity() user: any,
  ): Promise<RestaurantWithCouponsDto[]> {
    return await this.couponService.couponsFindByUserId(user);
  }

  @UseGuards(GqlCompanyAuthGuard)
  @Query(() => Number)
  async couponSelectByCompanyId(
    @CompanyEntity() company: any,
    @Args('data') data: CouponSelectDto,
  ): Promise<number> {
    return await this.couponService.couponSelectByCompanyId(company, data);
  }

  @UseGuards(GqlCompanyAuthGuard)
  @Mutation(() => Coupon)
  async couponCharge(
    @Args('data') data: CouponChargeDto,
    @CompanyEntity() company: any,
  ): Promise<Coupon> {
    return await this.couponService.couponCharge(data, company);
  }

  @UseGuards(GqlUserAuthGuard)
  @Mutation(() => BaseResponseDto)
  async couponUse(@Args('qrData') data: QrDataDto, @UserEntity() user: any): Promise<BaseResponseDto> {
    return await this.couponService.couponUse(data, user);
  }

  @UseGuards(GqlUserAuthGuard)
  @Query(() => QRCodeResponseDto)
  async generateQrCode(
    @Args('data') data: CouponUseDto,
    @UserEntity() user: any,
  ): Promise<QRCodeResponseDto> {
    return await this.couponService.generateQrCode(data, user);
  }
}
