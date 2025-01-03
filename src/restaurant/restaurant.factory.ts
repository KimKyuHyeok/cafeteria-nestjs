import { defineRestaurantFactory } from "src/__generated__/fabbrica";

export const restaurantFactory = defineRestaurantFactory({
    defaultData: {
        name: '테스트 식당',
        address: 'Address',
        price: 7000
    }
})