import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { RestaurantRegisterDto } from './dto/restaurant.register.dto';
import { Restaurant } from './model/restaurant.model';

@Injectable()
export class RestaurantService {
  constructor(private readonly prisma: PrismaService) {}

  // 식당 등록
  async restaurantRegister(data: RestaurantRegisterDto): Promise<Restaurant> {
    return await this.prisma.restaurant.create({
      data,
    });
  }

  // 주소로 식당찾기
  async restaurantFindByAddress(keyword: string): Promise<Restaurant[]> {
    return await this.prisma.restaurant.findMany({
      where: {
        address: {
          startsWith: keyword,
        },
      },
    });
  }

  // 이름으로 식당찾기
  async restaurantFindByName(keyword: string): Promise<Restaurant[]> {
    return await this.prisma.restaurant.findMany({
      where: {
        name: {
          startsWith: keyword,
        },
      },
    });
  }
}
