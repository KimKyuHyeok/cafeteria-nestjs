import { Logger, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppResolver } from './app.resolver';
import { ApolloDriver } from '@nestjs/apollo';
import { CompanyModule } from './company/company.module';
import { PrismaModule, loggingMiddleware } from 'nestjs-prisma';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    GraphQLModule.forRoot({
      debug: true,
      autoSchemaFile: true,
      driver: ApolloDriver
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
  ],
  providers: [AppResolver],
})
export class AppModule {}
