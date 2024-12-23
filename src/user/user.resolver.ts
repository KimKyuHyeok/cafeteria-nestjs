import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { Auth } from 'src/company/model/auth.model';
import { UserSignupInput } from './dto/user-signup.input';
import { Token } from 'src/common/auth/model/token.model';
import { UserSigninInput } from './dto/user-signin.input';

@Resolver()
export class UserResolver {
    constructor(private readonly userService: UserService){}

    @Mutation(() => Auth)
    async signup(@Args('data') data: UserSignupInput): Promise<Token> {
        const { accessToken, refreshToken } = await this.userService.signup(data);

        return {
            accessToken,
            refreshToken
        }
    }

    @Mutation(()  => Auth)
    async signin(@Args('data') data: UserSigninInput): Promise<Token> {
        const { accessToken, refreshToken } = await this.userService.signin(data);

        return {
            accessToken,
            refreshToken
        }  
    }
}
