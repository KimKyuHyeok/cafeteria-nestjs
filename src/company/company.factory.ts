import { defineCompanyFactory } from 'src/__generated__/fabbrica';

export const companyFactory = defineCompanyFactory({
  defaultData: {
    companyName: 'Kim Company',
    email: 'company@test.net',
    password: 'test1234@@',
    registrationNumber: '123-123-123',
    manager: 'James',
  },
});
