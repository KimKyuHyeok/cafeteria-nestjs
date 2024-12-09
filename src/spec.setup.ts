import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as jwt from 'jsonwebtoken'
import supertest from "supertest";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "./app.module";
import { PrismaService } from "nestjs-prisma";
import { graphqlUploadExpress } from 'graphql-upload';
import { Company } from "./company/model/company.model";
import { ConfigModule } from "@nestjs/config";

export let app: INestApplication;
let prisma: PrismaService;

export const request = (company: Company | null = null) => {
    if (company) {
        const token = jwt.sign({ companyId: company.id }, process.env.JWT_ACCESS_SECRET);

        return supertest(app.getHttpServer())
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`);
    }

    return supertest(app.getHttpServer()).post('/graphql');
};

export const expectError = (response: any, error: string) => {
    const errors: string[] = [];
    response.errors.forEach((e: any) => {
        errors.push(e.status);
    });

    expect(errors).toContain(error);
};

export const expectErrorMessage = (responseBody, expectedErrorMessage) => {
    expect(responseBody.errors).toBeDefined();
    expect(Array.isArray(responseBody.errors)).toBe(true);

    const errorMessages = responseBody.errors.map((error) => error.message);
    expect(errorMessages).toContain(expectedErrorMessage);
};


beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        AppModule
    ],
    }).compile();
  
    app = moduleFixture.createNestApplication();
    prisma = app.get(PrismaService); // PrismaService 가져오기
  
    app.useGlobalPipes(new ValidationPipe());
    app.use(graphqlUploadExpress({ maxFileSize: 2000000, maxFiles: 1 })); // graphql-upload 설정
  
    await app.init();
  });

afterEach(async () => {
    await app.close();
})