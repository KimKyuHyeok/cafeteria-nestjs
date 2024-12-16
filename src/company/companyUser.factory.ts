import { defineCompanyUserFactory } from "src/__generated__/fabbrica";


export function companyUserFactory(user: any, company: any) {
    const result = defineCompanyUserFactory({
        defaultData: {
            company: {
                connect: { id: company.id }
            },
            user: {
                connect: { id: user.id }
            },
            status: 'PENDING'
        }
    }).create();

    return result;
}