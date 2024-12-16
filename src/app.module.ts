import { Logger, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppResolver } from './app.resolver';
import { ApolloDriver } from '@nestjs/apollo';
import { CompanyModule } from './company/company.module';
import { PrismaModule, loggingMiddleware } from 'nestjs-prisma';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './company/jwt.strategy';
import { CompanyService } from './company/company.service';
import { PasswordService } from './common/auth/password.service';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      debug: true,
      autoSchemaFile: true,
      driver: ApolloDriver,
      context: ({ req }) => ({ req })
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [
          loggingMiddleware({
            logger: new Logger('PrismaMiddleware'),
            logLevel: 'log',
          })
        ]
      }
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    CompanyModule,
    UserModule,
  ],
  providers: [AppResolver, CompanyService, JwtStrategy, PasswordService, JwtService],
})
export class AppModule {}
