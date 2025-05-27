import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserSignupInput } from './input/user-signup.input';
import { Token } from 'src/common/auth/model/token.model';
import { UserSigninInput } from './input/user-signin.input';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { CompanyUserJoinRequestDto } from './dto/company-user-join.request';
import { UseGuards } from '@nestjs/common';
import { GqlUserAuthGuard } from 'src/company/gql-user-auth.guard';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { CompanySearchDto } from './dto/company-search.dto';
import { CompanySearchInput } from './input/company-search.input';
import { MyPageInfoDto } from './dto/mypage-info.dto';
import { UserInfoUpdateInput } from './input/user-info-update.input';
import GraphQLJSON from 'graphql-type-json';
import { AuthResponseDto } from './dto/auth.response.dto';
import { AuthSignupDto } from './dto/auth.signup.dto';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => Token)
  async userSignup(@Args('data') data: UserSignupInput): Promise<Token> {
    const { accessToken, refreshToken } = await this.userService.userSignup(data);

    return {
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => Token)
  async userSignin(@Args('data') data: UserSigninInput): Promise<Token> {
    const { accessToken, refreshToken } = await this.userService.userSignin(data);

    return {
      accessToken,
      refreshToken,
    };
  }

  @UseGuards(GqlUserAuthGuard)
  @Mutation(() => BaseResponseDto)
  async companyUserJoinRequest(
    @Args('data') data: CompanyUserJoinRequestDto,
    @UserEntity() user: any,
  ): Promise<BaseResponseDto> {
    return await this.userService.companyUserJoinRequest(data, user);
  }

  @UseGuards(GqlUserAuthGuard)
  @Query(() => CompanySearchDto)
  async companyListSearch(@Args('data') data: CompanySearchInput): Promise<CompanySearchDto> {
    return await this.userService.companyListSearch(data);
  }

  @UseGuards(GqlUserAuthGuard)
  @Query(() => MyPageInfoDto)
  async myPageInfoSelect(@UserEntity() user: any): Promise<MyPageInfoDto> {
    return await this.userService.myPageInfoSelect(user);
  }

  @UseGuards(GqlUserAuthGuard)
  @Mutation(() => BaseResponseDto)
  async myPageInfoUpdate(
    @UserEntity() user: any, @Args('data') data: UserInfoUpdateInput
    ): Promise<BaseResponseDto> {
      return await this.userService.myPageInfoUpdate(data, user);
  }
  
  @UseGuards(GqlUserAuthGuard)
  @Query(() => Boolean)
  async isValidateUser(@UserEntity() user: any): Promise<Boolean> {
    return this.userService.isValidateUser(user);
  }

  @Query(() => String)
  getKakaoAuthUrl(): string {
    return this.userService.getKakaoAuthUrl();
  }

  @Mutation(() => AuthResponseDto)
  loginWithKakao(
    @Args('code') code: string
  ): Promise<AuthResponseDto> {
    return this.userService.loginWithKakao(code);
  }

  @Mutation(() => Boolean)
  signupWithKakao(@Args('data') data: AuthSignupDto) {
    return this.userService.signupWithKakao(data);
  }
}
