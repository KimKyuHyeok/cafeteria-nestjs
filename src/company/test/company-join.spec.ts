import { userFactory } from "src/user/user.factory";
import { companyFactory } from "../company.factory";
import { companyUserFactory } from "../companyUser.factory";
import { expectError, expectErrorMessage, request } from "src/spec.setup";


describe('company-join', () => {
    let user: any;
    let company: any;
    let companyUser: any;

    beforeEach(async () =>  {
        user = await userFactory.create()
        company = await companyFactory.create()

        companyUser = await companyUserFactory(user, company);
    })

    // When : 올바른 정보로 userApproved 을 요청하면
    // Then : status 를 APPROVED 로 변경 후 결과 여부를 리턴한다. 
    it('When a valid request is received as userApproved, then the status will change to APPROVED and a success status will be returned.', async () => {
        const data = {
            userId: companyUser.userId,
            name: user.name,
            email: user.email
        }
        const response = await request(company).send({
            query: `
                mutation userApproved($data: CompanyJoinRequestDto!) {
                    userApproved(data: $data) {
                        success
                        message
                    }
                }
            `,
            variables: {
                data
            }
        })
        const result = response.body.data.userApproved;
        expect(result.success).toBe(true)
        expect(result.message).toBe('가입이 승인되었습니다.')
    })

    // When : 올바르지 않은 정보로 userApproved 을 요청하면
    // Then : errorMessage 를 리턴한다.
    it('When incorrect information is requested, then an error message is returned.', async () => {
        const data = {
            userId: companyUser.userId + 1,
            name: user.name,
            email: user.email
        }
        const response = await request(company).send({
            query: `
                mutation userApproved($data: CompanyJoinRequestDto!) {
                    userApproved(data: $data) {
                        success
                        message
                    }
                }
            `,
            variables: {
                data
            }
        })
        expectErrorMessage(response.body, '권한 혹은 데이터가 존재하지 않습니다.')
    })

    // When : 올바른 정보로 userRejected 을 요청하면
    // Then : status 를 REJECTED 로 변경 후 결과 여부를 리턴한다. 
    it('When a valid request is received as userRejected, then the status will change to REJECTED and a success status will be returned.', async () => {
        const data = {
            userId: companyUser.userId,
            name: user.name,
            email: user.email
        }
        const response = await request(company).send({
            query: `
                mutation userRejected($data: CompanyJoinRequestDto!) {
                    userRejected(data: $data) {
                        success
                        message
                    }
                }
            `,
            variables: {
                data
            }
        })

        const result = response.body.data.userRejected;
        expect(result.success).toBe(true)
        expect(result.message).toBe('가입 승인 거절이 완료되었습니다.')
    })

    // When : 올바르지 않은 정보로 userRejected 을 요청하면
    // Then : errorMessage 를 리턴한다.
    it('When incorrect information is requested, then an error message is returned.', async () => {
        const data = {
            userId: companyUser.userId + 1,
            name: user.name,
            email: user.email
        }
        const response = await request(company).send({
            query: `
                mutation userRejected($data: CompanyJoinRequestDto!) {
                    userRejected(data: $data) {
                        success
                        message
                    }
                }
            `,
            variables: {
                data
            }
        })
        expectErrorMessage(response.body, '권한 혹은 데이터가 존재하지 않습니다.')
    })

})