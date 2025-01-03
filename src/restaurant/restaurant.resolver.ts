import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RestaurantService } from './restaurant.service';
import { Restaurant } from './model/restaurant.model';

@Resolver()
export class RestaurantResolver {
    constructor(private readonly restaurantService: RestaurantService) {}

    //주소 저장 양식
    // 서울특별시-양천구-이하주소
    
    @Query(() => [Restaurant])
    async restaurantFindByAddress(@Args('keyword') keyword: string): Promise<Restaurant[]> {
        return await this.restaurantService.restaurantFindByAddress(keyword);
    }
}
