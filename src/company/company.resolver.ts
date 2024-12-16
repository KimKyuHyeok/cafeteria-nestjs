import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CompanyService } from './company.service';
import { CompanySignupInput } from './dto/company-signup.input';
import { Auth } from './model/auth.model';
import { CompanyEntity } from 'src/common/decorators/company.decorator';
import { CompanyJoinRequestDto } from './dto/company-join.request';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './gql-auth.guard';
import { CompanyJoinResponse } from './dto/company-join.response';
import { CompanySigninInput } from './dto/company-signin.input';
import { Token } from 'src/common/auth/model/token.model';

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

    @Mutation(() => Auth)
    async signin(@Args('data') data: CompanySigninInput): Promise<Token> {

        const { accessToken, refreshToken } = await this.companyService.signin(data);

        return {
            accessToken,
            refreshToken
        }
    }

    // 가입 승인
    @UseGuards(GqlAuthGuard)
    @Mutation(() => CompanyJoinResponse)
    async userApproved(@Args('data') data: CompanyJoinRequestDto, @CompanyEntity() company: any): Promise<CompanyJoinResponse> {
        return await this.companyService.userApproved(data, company);
    }

    // 가입 거절
    @UseGuards(GqlAuthGuard)
    @Mutation(() => CompanyJoinResponse)
    async userRejected(@Args('data') data: CompanyJoinRequestDto, @CompanyEntity() company: any): Promise<CompanyJoinResponse> {
        return await this.companyService.userRejected(data, company);
    }


}
