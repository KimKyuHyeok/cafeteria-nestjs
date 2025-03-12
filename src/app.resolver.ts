import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  @Query(() => String)
  appServer(): string {
    return 'Hello World!';
  }
}
