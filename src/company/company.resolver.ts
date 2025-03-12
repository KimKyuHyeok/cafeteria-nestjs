import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CompanyService } from './company.service';
import { CompanySignupInput } from './input/company-signup.input';
import { CompanyEntity } from 'src/common/decorators/company.decorator';
import { CompanyJoinRequestDto } from './dto/company-join.request';
import { UseGuards } from '@nestjs/common';
import { GqlCompanyAuthGuard } from './gql-company-auth.guard';
import { CompanySigninInput } from './input/company-signin.input';
import { Token } from 'src/common/auth/model/token.model';
import { userWithCompanyDto } from './dto/user-with-company.dto';
import { CompanyUserDto } from './dto/companyUser.dto';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';

@Resolver()
export class CompanyResolver {
  constructor(private readonly companyService: CompanyService) {}

  @Mutation(() => Token)
  async companySignup(@Args('data') data: CompanySignupInput) {
    const { accessToken, refreshToken } =
      await this.companyService.createCompany(data);

    return {
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => Token)
  async companySignin(@Args('data') data: CompanySigninInput): Promise<Token> {
    const { accessToken, refreshToken } =
      await this.companyService.companySignin(data);

    return {
      accessToken,
      refreshToken,
    };
  }

  // 가입 승인
  @UseGuards(GqlCompanyAuthGuard)
  @Mutation(() => BaseResponseDto)
  async userApproved(
    @Args('data') data: CompanyJoinRequestDto,
    @CompanyEntity() company: any,
  ): Promise<BaseResponseDto> {
    return await this.companyService.userApproved(data, company);
  }

  // 가입 거절
  @UseGuards(GqlCompanyAuthGuard)
  @Mutation(() => BaseResponseDto)
  async userRejected(
    @Args('data') data: CompanyJoinRequestDto,
    @CompanyEntity() company: any,
  ): Promise<BaseResponseDto> {
    return await this.companyService.userRejected(data, company);
  }

  // 가입 요청 리스트
  @UseGuards(GqlCompanyAuthGuard)
  @Query(() => [userWithCompanyDto])
  async userWithCompanyListAll(
    @CompanyEntity() company: any,
  ): Promise<userWithCompanyDto[]> {
    return this.companyService.userWithCompanyListAll(company);
  }

  // 승인 대기 리스트
  @UseGuards(GqlCompanyAuthGuard)
  @Query(() => [userWithCompanyDto])
  async userWithCompanyListByPending(
    @CompanyEntity() company: any,
  ): Promise<userWithCompanyDto[]> {
    return this.companyService.userWithCompanyListByPending(company);
  }

  // 승인 완료 리스트
  @UseGuards(GqlCompanyAuthGuard)
  @Query(() => [userWithCompanyDto])
  async userWithCompanyListByApproved(
    @CompanyEntity() company: any,
  ): Promise<userWithCompanyDto[]> {
    return this.companyService.userWithCompanyListByApproved(company);
  }

  // 승인 거절 리스트
  @UseGuards(GqlCompanyAuthGuard)
  @Query(() => [userWithCompanyDto])
  async userWithCompanyListByRejected(
    @CompanyEntity() company: any,
  ): Promise<userWithCompanyDto[]> {
    return this.companyService.userWithCompanyListByRejected(company);
  }

  @UseGuards(GqlCompanyAuthGuard)
  @Mutation(() => BaseResponseDto)
  async userCompanyDelete(
    @Args('data') data: CompanyUserDto,
    @CompanyEntity() company: any,
  ): Promise<BaseResponseDto> {
    return this.companyService.userCompanyDelete(data, company);
  }
}
