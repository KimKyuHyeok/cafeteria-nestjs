import { companyFactory } from 'src/company/company.factory';
import { userFactory } from '../user.factory';
import { expectErrorMessage, request } from 'src/spec.setup';
import { User } from '../models/user.model';
import { companyUserFactory } from 'src/company/companyUser.factory';

describe('user-with-company-request', () => {
  let company: any;
  let user: User;

  beforeEach(async () => {
    company = await companyFactory.create({ email: 'user-with-company@email.com' });
    user = await userFactory.create();
  });

  // When: 올바른 정보로 companyUserJoinRequest 를 요청하면
  // Then: true 와 메시지를 반환한다.
  it('When a valid companyUserJoinRequest is made, then it returns true along with a message.', async () => {
    const data = {
      companyId: company.id,
    };
    const response = await request(user).send({
      query: `
                    mutation companyUserJoinRequest($data: CompanyUserJoinRequestDto!) {
                        companyUserJoinRequest(data: $data) {
                            success
                            message
                    }
                }
            `,
      variables: {
        data,
      },
    });

    const result = response.body.data.companyUserJoinRequest;
    expect(result.success).toBe(true);
    expect(result.message).toBe('신청이 완료되었습니다.');
  });

  // When: status 가 PENDING 인 상태에서 companyUserJoinRequest 를 요청하면
  // Then: false 와 메시지를 리턴한다.
  it('When a companyUserJoinRequest is made while in a pending approval state, then it returns false along with a message.', async () => {
    const factory = await companyUserFactory(user, company, 'PENDING');
    const response = await request(user).send({
      query: `
                mutation companyUserJoinRequest($data: CompanyUserJoinRequestDto!) {
                    companyUserJoinRequest(data: $data) {
                        success
                        message
                    }
                }
            `,
      variables: {
        data: { companyId: company.id },
      },
    });

    expectErrorMessage(response.body, '이미 신청했거나 승인거절 상태입니다.');
  });

  // When: status 가 REJECTED 상태에서 companyUserJoinRequest 를 요청하면
  // Then: false 와 메시지를 반환한다.
  it('When a companyUserJoinRequest is made after the request has been rejected, then it returns false along with a message.', async () => {
    const factory = await companyUserFactory(user, company, 'REJECTED');
    const response = await request(user).send({
      query: `
                mutation companyUserJoinRequest($data: CompanyUserJoinRequestDto!) {
                    companyUserJoinRequest(data: $data) {
                        success
                        message
                    }
                }
            `,
      variables: {
        data: { companyId: company.id },
      },
    });

    expectErrorMessage(response.body, '이미 신청했거나 승인거절 상태입니다.');
  });
});
