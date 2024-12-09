import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CompanyService } from './company.service';
import { CompanySignupInput } from './dto/company-signup.input';
import { Auth } from './model/auth.model';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './gql-auth.guard';

@Resolver()
export class CompanyResolver {
    constructor(private readonly companyService: CompanyService) {}

    @Mutation(() => Auth)
    async signup(@Args('data') data: CompanySignupInput) {
        const { accessToken, refreshToken } = await this.companyService.createCompany(data);

        return {
            accessToken,
            refreshToken
        }
    }
}
