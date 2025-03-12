import { definePaymentsFactory } from 'src/__generated__/fabbrica';

export function paymentsFactory(company: any) {
  return definePaymentsFactory({
    defaultData: {
      company: { connect: { id: company.id } },
      orderId: 'Test-payments',
      amount: 7000,
      paymentMethod: 'Test-method',
      paymentStatus: 'Test-status',
      transactionId: 'Test-transaction',
    },
  });
}
