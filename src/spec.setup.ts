import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as jwt from 'jsonwebtoken'
import supertest from "supertest";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "./app.module";
import { PrismaService } from "nestjs-prisma";
import { graphqlUploadExpress } from 'graphql-upload';
import { Company } from "./company/model/company.model";
import { ConfigModule } from "@nestjs/config";
import { User } from "./user/models/user.model";

export let app: INestApplication;
let prisma: PrismaService;

export const request = (entity?: Company | User | null) => {
    if (entity === null) {
        return supertest(app.getHttpServer()).post('/graphql');
    }

    let token: string;
    
    if ('registrationNumber' in entity) {
        const company = entity;
        token = jwt.sign({ companyId: company.id }, process.env.JWT_ACCESS_SECRET);
    }
    else {
        const user = entity;
        token = jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET);
    }

    return supertest(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`);
};

export const userRequest = (user: User | null = null) => {
    if (user) {
        const token = jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET);

        return supertest(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`);
    }
    return supertest(app.getHttpServer()).post('/graphql')
}

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
    })
    .overrideProvider(PrismaService)
    .useValue(jestPrisma.client)
    .compile();
  
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.use(graphqlUploadExpress({ maxFileSize: 2000000, maxFiles: 1 }));
    await app.init();
  });

afterEach(async () => {
    await app.close();
})