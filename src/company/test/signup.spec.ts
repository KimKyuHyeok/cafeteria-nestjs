import { expectErrorMessage, request } from 'src/spec.setup';
import { companyFactory } from '../company.factory';

describe('signup', () => {
  let company;

  beforeEach(async () => {
    company = await companyFactory.create();
  });

  // When : 옳바른 정보로 Company SignUp 을 요청하면
  // Then : accessToken 과 refreshToken 을 반환한다.
  it('when you request Company membership with the correct information then AccessToken and RefreshToken are returned.', async () => {
    const data = {
      name: 'Kim',
      registrationNumber: '123-1234-123',
      password: 'Password123@',
      manager: 'James',
    };

    const response = await request().send({
      query: `
                mutation signup($data: CompanySignupInput!) {
                    signup(data: $data) {
                        accessToken
                        refreshToken
                    }
                }
            `,
      variables: {
        data: data,
      },
    });
    expect(response).toBeDefined();
    expect(response.status).toBe(200);

    const { accessToken, refreshToken } = response.body.data.signup;
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
  });

  // When: 형식에 맞지 않는 비밀번호를 이용해 SignUp 요청을 하면
  // Then: 에러 메시지를 반환한다.
  it('when a SignUp request is made using a password with an incorrect format then an error message is returned.', async () => {
    const data = {
      name: 'Kim',
      registrationNumber: '123-1234-123',
      password: 'Pass123',
      manager: 'James',
    };

    const response = await request().send({
      query: `
                mutation signup($data: CompanySignupInput!) {
                    signup(data: $data) {
                        accessToken
                        refreshToken
                    }
                }
            `,
      variables: {
        data: data,
      },
    });

    expect(response.body).toHaveProperty('errors'); // errors 필드가 존재해야 함
    expect(response.body.errors[0].message).toBe(
      '비밀번호는 최소 8자 이상이어야 하며, 대문자, 소문자, 숫자 및 특수문자를 포함해야 합니다.',
    );
  });

  // When: 이미 등록된 사업자 번호를 입력하면
  // Then: 에러 메시지를 반환한다.
  it('when a SignUp request is made with an already registered business number then an error message is returned.', async () => {
    const data = {
      name: 'Kim',
      registrationNumber: '123-123-123',
      password: 'Password1234@@',
      manager: 'James',
    };

    const response = await request().send({
      query: `
                mutation signup($data: CompanySignupInput!) {
                    signup(data: $data) {
                        accessToken
                        refreshToken
                    }
                }
            `,
      variables: {
        data: data,
      },
    });
    expectErrorMessage(response.body, '이미 등록된 사업자 번호 입니다.');
  });
});
