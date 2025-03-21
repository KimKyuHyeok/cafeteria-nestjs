import { Token } from 'src/common/auth/model/token.model';
import { StoreService } from './store.service';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Auth } from 'src/company/model/auth.model';
import { StoreSigninInput } from './input/store-siginin.input';
import { StoreSignupInput } from './input/store-siginup.input';

@Resolver()
export class StoreResolver {
  constructor(private readonly storeService: StoreService) {}

  @Mutation(() => Token)
  async storeSignin(@Args('data') data: StoreSigninInput): Promise<Token> {
    const { accessToken, refreshToken } =
      await this.storeService.storeSignin(data);

    return {
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => Token)
  async storeSignup(@Args('data') data: StoreSignupInput): Promise<Token> {
    const { accessToken, refreshToken } =
      await this.storeService.storeSignup(data);

    return {
      accessToken,
      refreshToken,
    };
  }
}
