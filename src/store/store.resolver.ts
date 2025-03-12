import { Token } from 'src/common/auth/model/token.model';
import { StoreInput } from './dto/store-input.dto';
import { StoreService } from './store.service';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Auth } from 'src/company/model/auth.model';

@Resolver()
export class StoreResolver {
  constructor(private readonly storeService: StoreService) {}

  @Mutation(() => Token)
  async storeSignin(@Args('data') data: StoreInput): Promise<Token> {
    const { accessToken, refreshToken } =
      await this.storeService.storeSignin(data);

    return {
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => Token)
  async storeSignup(@Args('data') data: StoreInput): Promise<Token> {
    const { accessToken, refreshToken } =
      await this.storeService.storeSignup(data);

    return {
      accessToken,
      refreshToken,
    };
  }
}
