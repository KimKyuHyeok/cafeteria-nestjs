import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { Auth } from 'src/company/model/auth.model';
import { UserSignupInput } from './dto/user-signup.input';
import { Token } from 'src/common/auth/model/token.model';
import { UserSigninInput } from './dto/user-signin.input';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { CompanyUserResponse } from 'src/company/dto/companyUser.response';
import { CompanyUserJoinRequestDto } from './dto/companyUserJoinRequest.dto';
import { UseGuards } from '@nestjs/common';
import { GqlUserAuthGuard } from 'src/company/gql-user-auth.guard';
import { Company } from 'src/company/model/company.model';

@Resolver()
export class UserResolver {
    constructor(private readonly userService: UserService){}

    @Mutation(() => Auth)
    async userSignup(@Args('data') data: UserSignupInput): Promise<Token> {
        const { accessToken, refreshToken } = await this.userService.signup(data);

        return {
            accessToken,
            refreshToken
        }
    }

    @Mutation(()  => Auth)
    async userSignin(@Args('data') data: UserSigninInput): Promise<Token> {
        const { accessToken, refreshToken } = await this.userService.signin(data);

        return {
            accessToken,
            refreshToken
        }  
    }

    @UseGuards(GqlUserAuthGuard)
    @Mutation(() => CompanyUserResponse)
    async companyUserJoinRequest(@Args('data') data: CompanyUserJoinRequestDto, @UserEntity() user: any): Promise<CompanyUserResponse> {
        return await this.userService.companyUserJoinRequest(data, user);
    }

    @UseGuards(GqlUserAuthGuard)
    @Query(() => [Company])
    async companyListSearch(@Args('keyword') keyword: string): Promise<Company[]> {
        return await this.userService.companyListSearch(keyword);
    }
}
