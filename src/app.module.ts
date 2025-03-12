import { Logger, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppResolver } from './app.resolver';
import { ApolloDriver } from '@nestjs/apollo';
import { CompanyModule } from './company/company.module';
import { PrismaModule, loggingMiddleware } from 'nestjs-prisma';
import { ConfigModule } from '@nestjs/config';
import { JwtCompanyStrategy } from './company/jwt.company.strategy';
import { CompanyService } from './company/company.service';
import { PasswordService } from './common/auth/password.service';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { JwtUserStrategy } from './company/jwt.user.strategy';
import { UserService } from './user/user.service';
import { CouponModule } from './coupon/coupon.module';
import { RestaurantResolver } from './restaurant/restaurant.resolver';
import { RestaurantService } from './restaurant/restaurant.service';
import { RestaurantModule } from './restaurant/restaurant.module';
import { PaymentsModule } from './payments/payments.module';
import { UsageHistoryResolver } from './usage-history/usage-history.resolver';
import { UsageHistoryModule } from './usage-history/usage-history.module';
import { StoreResolver } from './store/store.resolver';
import { StoreService } from './store/store.service';
import { StoreModule } from './store/store.module';
import { join } from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot({
      debug: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      driver: ApolloDriver,
      context: ({ req }) => ({ req }),
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [
          loggingMiddleware({
            logger: new Logger('PrismaMiddleware'),
            logLevel: 'log',
          }),
        ],
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CompanyModule,
    UserModule,
    CouponModule,
    RestaurantModule,
    PaymentsModule,
    UsageHistoryModule,
    StoreModule,
  ],
  providers: [
    AppResolver,
    CompanyService,
    UserService,
    JwtCompanyStrategy,
    JwtUserStrategy,
    PasswordService,
    JwtService,
    RestaurantResolver,
    RestaurantService,
    UsageHistoryResolver,
    StoreResolver,
    StoreService,
  ],
})
export class AppModule {}
