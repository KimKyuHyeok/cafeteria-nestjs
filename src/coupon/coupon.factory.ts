import { defineCouponFactory } from "src/__generated__/fabbrica";

export function couponFactory(company: any, restaurant: any, payment: any, count: number) {
    
    return defineCouponFactory({
        defaultData: {
            company: { connect: { id: company.id }},
            restaurant: { connect: { id: restaurant.id }},
            payments: { connect: { id: payment.id }},
            count
        }  
    })
}