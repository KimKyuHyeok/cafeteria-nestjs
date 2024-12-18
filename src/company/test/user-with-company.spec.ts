import { userFactory } from "src/user/user.factory"
import { companyFactory } from "../company.factory"
import { companyUserFactory } from "../companyUser.factory"
import { expectError, expectErrorMessage, request } from "src/spec.setup"


describe('user-with-company', () => {
    let userPending: any
    let userApproved: any
    let userRejected: any
    let company: any

    let companyUserPending: any
    let companyUserApproved: any
    let companyUserRejected: any

    beforeEach(async () => {
        userPending = await userFactory.create({
            name: 'user-pending',
            email: 'pending-test@naver.com'
        });
        userApproved = await userFactory.create({
            name: 'user-approved',
            email: 'approved-test@naver.com'
        });
        userRejected = await userFactory.create({
            name: 'user-rejected',
            email: 'rejected-test@naver.com'
        })
        company = await companyFactory.create();

        companyUserPending = await companyUserFactory(userPending, company, 'PENDING');
        companyUserApproved = await companyUserFactory(userApproved, company, 'APPROVED');
        companyUserRejected = await companyUserFactory(userRejected, company, 'REJECTED');
    })

    it('When a LIST query is requested, then the data is returned.', async() => {
        
        const response = await request(company).send({
            query: `
                query {
                    userWithCompanyListAll {
                        name
                        phoneNumber
                        email
                        status
                    }
                }
            `
        })
        expect(response.body.data.userWithCompanyListAll).toHaveLength(3);
    })

    it('When a PENDING LIST query is requested, then the data is returned.', async() => {
        const response = await request(company).send({
            query: `
                query {
                    userWithCompanyListByPending {
                        name
                        phoneNumber
                        email
                        status
                    }
                }
            `
        })
        
        expect(response.body.data.userWithCompanyListByPending[0].status).toBe('PENDING')
    })

    it('When a APPROVED LIST query is requested, then the data is returned.', async() => {
        const response = await request(company).send({
            query: `
                query {
                    userWithCompanyListByApproved {
                        name
                        phoneNumber
                        email
                        status
                    }
                }
            `
        })
        
        expect(response.body.data.userWithCompanyListByApproved[0].status).toBe('APPROVED')
    })

    it('When a REJECTED LIST query is requested, then the data is returned.', async() => {
        const response = await request(company).send({
            query: `
                query {
                    userWithCompanyListByRejected {
                        name
                        phoneNumber
                        email
                        status
                    }
                }
            `
        })
        
        expect(response.body.data.userWithCompanyListByRejected[0].status).toBe('REJECTED')
    })

    it('When a request is made without the necessary permissions, then an error message stating Unauthorized is returned.', async() => {
        
        const response = await request().send({
            query: `
                query {
                    userWithCompanyListAll {
                        name
                        phoneNumber
                        email
                        status
                    }
                }
            `
        })
        expectErrorMessage(response.body, 'Unauthorized')
    })
})