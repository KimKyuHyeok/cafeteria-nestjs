import { request } from "src/spec.setup"


describe('signup', () => {

    it('signup-test', async () => {
        const data = {
            name: 'Kim',
            registrationNumber: '123-123-123',
            password: 'Password123@',
            manager: 'James'
        }

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
                data: data
            }
        })

        console.log(response.body)
    })
})