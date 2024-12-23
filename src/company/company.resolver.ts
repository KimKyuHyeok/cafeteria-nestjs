import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CompanyService } from './company.service';
import { CompanySignupInput } from './dto/company-signup.input';
import { Auth } from './model/auth.model';
import { CompanyEntity } from 'src/common/decorators/company.decorator';
import { CompanyJoinRequestDto } from './dto/company-join.request';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './gql-auth.guard';
import { CompanyUserResponse } from './dto/companyUser.response';
import { CompanySigninInput } from './dto/company-signin.input';
import { Token } from 'src/common/auth/model/token.model';
import { userWithCompanyDto } from './dto/user-with-company.dto';
import { CompanyUserDto } from './dto/companyUser.dto';

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
    @Mutation(() => CompanyUserResponse)
    async userApproved(@Args('data') data: CompanyJoinRequestDto, @CompanyEntity() company: any): Promise<CompanyUserResponse> {
        return await this.companyService.userApproved(data, company);
    }

    // 가입 거절
    @UseGuards(GqlAuthGuard)
    @Mutation(() => CompanyUserResponse)
    async userRejected(@Args('data') data: CompanyJoinRequestDto, @CompanyEntity() company: any): Promise<CompanyUserResponse> {
        return await this.companyService.userRejected(data, company);
    }

    // 가입 요청 리스트
    @UseGuards(GqlAuthGuard)
    @Query(() => [userWithCompanyDto])
    async userWithCompanyListAll(@CompanyEntity() company: any): Promise<userWithCompanyDto[]> {
        return this.companyService.userWithCompanyListAll(company);
    }

    // 승인 대기 리스트
    @UseGuards(GqlAuthGuard)
    @Query(() => [userWithCompanyDto])
    async userWithCompanyListByPending(@CompanyEntity() company: any): Promise<userWithCompanyDto[]> {
        return this.companyService.userWithCompanyListByPending(company);
    }

    // 승인 완료 리스트
    @UseGuards(GqlAuthGuard)
    @Query(() => [userWithCompanyDto])
    async userWithCompanyListByApproved(@CompanyEntity() company: any): Promise<userWithCompanyDto[]> {
        return this.companyService.userWithCompanyListByApproved(company);
    }

    // 승인 거절 리스트
    @UseGuards(GqlAuthGuard)
    @Query(() => [userWithCompanyDto])
    async userWithCompanyListByRejected(@CompanyEntity() company: any): Promise<userWithCompanyDto[]> {
        return this.companyService.userWithCompanyListByRejected(company);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => CompanyUserResponse)
    async userCompanyDelete(@Args('data') data: CompanyUserDto, @CompanyEntity() company: any): Promise<CompanyUserResponse> {
        return this.companyService.userCompanyDelete(data, company);
    }


    


}
