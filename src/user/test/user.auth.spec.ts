import { expectErrorMessage, request } from 'src/spec.setup';
import { userFactory } from '../user.factory';
import { PasswordService } from 'src/common/auth/password.service';
import { ConfigService } from '@nestjs/config';

describe('user-auth', () => {
  let passwordService: PasswordService;
  let user: any;

  beforeAll(async () => {
    const config = new ConfigService();
    passwordService = new PasswordService(config);
  });

  beforeEach(async () => {
    const hashPassword = await passwordService.hashPassword('Password12@@');
    user = await userFactory.create({
      password: hashPassword,
    });
  });

  it('when you request User Signup with the correct information then AccessToken and RefreshToken are returned.', async () => {
    const data = {
      name: 'KimKH',
      phoneNumber: '010-0000-0000',
      email: 'kkh@test.com',
      password: 'Password12@@',
    };

    const response = await request().send({
      query: `
                mutation userSignup($data: UserSignupInput!) {
                    userSignup(data: $data) {
                        accessToken
                        refreshToken
                    }
                }
            `,
      variables: {
        data,
      },
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(200);

    const { accessToken, refreshToken } = response.body.data.userSignup;
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
  });

  it('when a SignUp request is made using a password with an incorrect format then an error message is returned.', async () => {
    const data = {
      name: 'KimKH',
      phoneNumber: '010-0000-0000',
      email: 'kkh@test.com',
      password: 'Pass1234',
    };

    const response = await request().send({
      query: `
                mutation userSignup($data: UserSignupInput!) {
                    userSignup(data: $data) {
                        accessToken
                        refreshToken
                    }
                }
            `,
      variables: {
        data,
      },
    });

    expect(response.body).toHaveProperty('errors'); // errors 필드가 존재해야 함
    expect(response.body.errors[0].message).toBe(
      '비밀번호는 최소 8자 이상이어야 하며, 대문자, 소문자, 숫자 및 특수문자를 포함해야 합니다.',
    );
  });

  it('when a SignUp request is made with an already registered email then an error message is returned.', async () => {
    const data = {
      name: 'KimKH',
      phoneNumber: '010-0000-0000',
      email: user.email,
      password: 'Pass1234@@',
    };

    const response = await request().send({
      query: `
                mutation userSignup($data: UserSignupInput!) {
                    userSignup(data: $data) {
                        accessToken
                        refreshToken
                    }
                }
            `,
      variables: {
        data,
      },
    });

    expectErrorMessage(response.body, '이미 가입된 이메일 입니다.');
  });

  it('when you request User Signin with the correct information then AccessToken and RefreshToken are returned.', async () => {
    const data = {
      email: user.email,
      password: 'Password12@@',
    };

    const response = await request().send({
      query: `
                mutation userSignin($data: UserSigninInput!) {
                    userSignin(data: $data) {
                        accessToken
                        refreshToken
                    }
                }
            `,
      variables: {
        data,
      },
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(200);

    const { accessToken, refreshToken } = response.body.data.userSignin;
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
  });
});
