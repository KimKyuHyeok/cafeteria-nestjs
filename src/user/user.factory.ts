import { defineUserFactory } from 'src/__generated__/fabbrica';

const randomEmail = () => `${Math.random().toString(36).substring(7)}@test.com`;

export const userFactory = defineUserFactory({
  defaultData: {
    name: '김규혁',
    phoneNumber: '010-0000-0000',
    email: randomEmail(),
  },
});
