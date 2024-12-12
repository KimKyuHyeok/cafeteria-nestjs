import { defineCompanyFactory } from "src/__generated__/fabbrica";


export const companyFactory = defineCompanyFactory({
    defaultData: {
        name: 'Kim Company',
        password: 'test1234@@',
        registrationNumber: '123-123-123',
        manager: 'James'
    }
})