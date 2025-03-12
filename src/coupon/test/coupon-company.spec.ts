import { companyFactory } from 'src/company/company.factory';
import { paymentsFactory } from 'src/payments/payments.factory';
import { restaurantFactory } from 'src/restaurant/restaurant.factory';
import { couponFactory } from '../coupon.factory';
import { expectErrorMessage, request } from 'src/spec.setup';
import { userFactory } from 'src/user/user.factory';
import { companyUserFactory } from 'src/company/companyUser.factory';

describe('coupon-company', () => {
  let company: any;
  let payments1: any;
  let payments2: any;
  let restaurant: any;
  let coupon1: any;
  let coupon2: any;
  let user: any;
  let companyUser: any;
  let unauthorizedUser: any;

  beforeEach(async () => {
    company = await companyFactory.create({ email: 'coupon-company@email.com' });
    payments1 = await paymentsFactory(company).create();
    payments2 = await paymentsFactory(company).create();
    restaurant = await restaurantFactory.create();
    coupon1 = await couponFactory(company, restaurant, payments1, 10).create();
    coupon2 = await couponFactory(company, restaurant, payments2, 20).create();
    user = await userFactory.create();
    unauthorizedUser = await userFactory.create({
      email: 'unauthorizedUser@test.com',
    });
    companyUser = await companyUserFactory(user, company, 'APPROVED');
  });

  it('When the CompanyId and restaurantId are provided, then the remaining coupon quantity is returned.', async () => {
    const response = await request(company).send({
      query: `
                query couponSelectByCompanyId($data: CouponSelectDto!) {
                    couponSelectByCompanyId(data: $data)
                }              
            `,
      variables: {
        data: { restaurantId: restaurant.id },
      },
    });

    const result = response.body.data.couponSelectByCompanyId;
    expect(result).toBe(30);
  });

  it('When a company without permission requests couponSelectByCompanyId, then an error message is returned.', async () => {
    const response = await request().send({
      query: `
                query couponSelectByCompanyId($data: CouponSelectDto!) {
                    couponSelectByCompanyId(data: $data)
                }              
            `,
      variables: {
        data: { restaurantId: restaurant.id },
      },
    });

    expectErrorMessage(response.body, 'Unauthorized');
  });

  it('When a valid request is sent to couponCharge, it returns the result and then returns the total count of coupons.', async () => {
    const response = await request(company).send({
      query: `
                mutation couponCharge($data: CouponChargeDto!) {
                    couponCharge(data: $data) {
                        companyId
                        restaurantId
                        paymentsId
                        count
                    }
                }
            `,
      variables: {
        data: {
          companyId: company.id,
          restaurantId: restaurant.id,
          paymentsId: payments1.id,
          count: 50,
        },
      },
    });
    const result = response.body.data.couponCharge;
    const count = await await selectCount(company, restaurant);

    expect(result.companyId).toBe(company.id);
    expect(result.restaurantId).toBe(restaurant.id);
    expect(result.paymentsId).toBe(payments1.id);
    expect(result.count).toBe(50);
    expect(count).toBe(80);
  });

  it('When a valid request is sent to couponUse, it returns success and message, and then checks if the coupon quantity has been deducted.', async () => {
    const couponId = coupon1.id;
    
    const response = await request(user).send({
      query: `
                mutation couponUse($qrData: QrDataDto!) {
                    couponUse(qrData: $qrData) {
                        success
                        message
                    }
                }
            `,
      variables: {
        qrData: { couponId }
      },
    });

    const result = response.body.data.couponUse;
    const count = await selectCount(company, restaurant);

    expect(result.success).toBe(true);
    expect(result.message).toBe('식권 사용이 완료되었습니다.');
    expect(count).toBe(29);
  });

  it('When a user without permission sends a request to CouponUse, then an error message is returned.', async () => {
    const couponId = coupon1.id;
    const response = await request(unauthorizedUser).send({
      query: `
                mutation couponUse($qrData: QrDataDto!) {
                    couponUse(qrData: $qrData) {
                        success
                        message
                    }
                }
            `,
      variables: {
        qrData: { couponId }
      },
    });

    expectErrorMessage(response.body, '현재 소속된 기업이 존재하지 않습니다.');
  });
});

async function selectCount(company: any, restaurant: any) {
  const count = await request(company).send({
    query: `
        query couponSelectByCompanyId($data: CouponSelectDto!) {
            couponSelectByCompanyId(data: $data)
        }              
        `,
    variables: {
      data: { restaurantId: restaurant.id },
    },
  });

  return count.body.data.couponSelectByCompanyId;
}
