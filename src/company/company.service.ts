import { ConflictException, Injectable } from '@nestjs/common';
import { Company } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { CompanySignupInput } from './dto/company-signup.input';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from 'src/common/auth/password.service';
import { Token } from 'src/common/auth/model/token.model';

@Injectable()
export class CompanyService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly passwordService: PasswordService,
        private readonly jwtService: JwtService,
    ) {}

    async createCompany(payload: CompanySignupInput): Promise<Token> {
        payload.password = await this.passwordService.hashPassword(payload.password)

        try {
            const check = await this.prisma.company.findMany({
                where: { registrationNumber: payload.registrationNumber }
            })
            
            if (check.length > 0) throw new ConflictException('이미 등록된 사업자 번호 입니다.')

            const company = await this.prisma.company.create({
                data: {
                    ...payload,
                }
            })

            return this.generateTokens({
                companyId: company.id
            })
            
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            throw new Error('An unexpected error occurred during company creation.');
            }
    }

    validateCompany(companyId: number): Promise<Company> {
        return this.prisma.company.findUnique({ where: { id: companyId }})
    }

    generateTokens(payload: { companyId: number }): Token {
        return {
            accessToken: this.generateAccessToken(payload),
            refreshToken: this.generateRefreshToken(payload),
        }
    }

    private generateAccessToken(payload: { companyId: number }): string {
        return this.jwtService.sign(payload, {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: '24h',
        });
    }

    private generateRefreshToken(payload: { companyId: number }): string {
        return this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: '7d',
        });
    }

    
}
