import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Company } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { CompanySignupInput } from './input/company-signup.input';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from 'src/common/auth/password.service';
import { Token } from 'src/common/auth/model/token.model';
import { CompanyJoinRequestDto } from './dto/company-join.request';
import { CompanySigninInput } from './input/company-signin.input';
import { userWithCompanyDto } from './dto/user-with-company.dto';
import { CompanyUserDto } from './dto/companyUser.dto';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';

@Injectable()
export class CompanyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async companySignin(data: CompanySigninInput): Promise<Token> {
    const company = await this.prisma.company.findFirst({
      where: { email: data.email },
    });
  
    if (!company) throw new UnauthorizedException('해당 이메일로 등록된 사용자가 없습니다.');
  
    const passwordValid = await this.passwordService.validatePassword(
      data.password,
      company.password,
    );
  
    if (!passwordValid) throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
  
    return this.generateTokens({
      companyId: company.id,
    });
  }
  
  async createCompany(payload: CompanySignupInput): Promise<Token> {
    payload.password = await this.passwordService.hashPassword(
      payload.password,
    );

    const existingCompany = await this.prisma.company.findFirst({
      where: { email: payload.email },
    });

    if (existingCompany)
      throw new ConflictException('이미 등록된 이메일 입니다.');

    const company = await this.prisma.company.create({
      data: {
        ...payload,
      },
    });

    return this.generateTokens({
      companyId: company.id,
    });
}

  validateCompany(companyId: number): Promise<Company> {
    return this.prisma.company.findUnique({ where: { id: companyId } });
  }

  generateTokens(payload: { companyId: number }): Token {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
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

  async userApproved(
    data: CompanyJoinRequestDto,
    company: any,
  ): Promise<BaseResponseDto> {
    const companyUser = await this.prisma.companyUser.findFirst({
      where: {
        companyId: company.id,
        status: 'PENDING',
        userId: data.userId,
      },
    });

    if (!companyUser)
      throw new NotFoundException('권한 혹은 데이터가 존재하지 않습니다.');

    await this.prisma.companyUser.update({
      where: {
        id: companyUser.id,
      },
      data: {
        status: 'APPROVED',
      },
    });
    return {
      success: true,
      message: '가입이 승인되었습니다.',
    };
  }

  async userRejected(
    data: CompanyJoinRequestDto,
    company: any,
  ): Promise<BaseResponseDto> {
    const companyUser = await this.prisma.companyUser.findFirst({
      where: {
        companyId: company.id,
        status: 'PENDING',
        userId: data.userId,
      },
    });

    if (!companyUser)
      throw new NotFoundException('권한 혹은 데이터가 존재하지 않습니다.');

    await this.prisma.companyUser.update({
      where: {
        id: companyUser.id,
      },
      data: {
        status: 'REJECTED',
      },
    });

    return {
      success: true,
      message: '가입 승인 거절이 완료되었습니다.',
    };
  }

  async userWithCompanyListAll(company: any): Promise<userWithCompanyDto[]> {
    const users = await this.prisma.user.findMany({
      where: {
        CompanyUser: {
          some: {
            companyId: company.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        email: true,
        CompanyUser: {
          where: {
            companyId: company.id,
          },
          select: {
            id: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      email: user.email,
      status: user.CompanyUser[0]?.status,
      companyUserId: user.CompanyUser[0].id,
      createdAt: user.CompanyUser[0]?.createdAt,
      updatedAt: user.CompanyUser[0]?.updatedAt,
    }));
  }

  async userWithCompanyListByPending(
    company: any,
  ): Promise<userWithCompanyDto[]> {
    const users = await this.prisma.user.findMany({
      where: {
        CompanyUser: {
          some: {
            companyId: company.id,
            status: 'PENDING',
          },
        },
      },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        email: true,
        CompanyUser: {
          where: {
            companyId: company.id,
          },
          select: {
            id: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      email: user.email,
      status: user.CompanyUser[0]?.status,
      companyUserId: user.CompanyUser[0].id,
      createdAt: user.CompanyUser[0]?.createdAt,
      updatedAt: user.CompanyUser[0]?.updatedAt,
    }));
  }

  async userWithCompanyListByApproved(
    company: any,
  ): Promise<userWithCompanyDto[]> {
    const users = await this.prisma.user.findMany({
      where: {
        CompanyUser: {
          some: {
            companyId: company.id,
            status: 'APPROVED',
          },
        },
      },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        email: true,
        CompanyUser: {
          where: {
            companyId: company.id,
          },
          select: {
            id: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      email: user.email,
      status: user.CompanyUser[0]?.status,
      companyUserId: user.CompanyUser[0].id,
      createdAt: user.CompanyUser[0]?.createdAt,
      updatedAt: user.CompanyUser[0]?.updatedAt,
    }));
  }

  async userWithCompanyListByRejected(
    company: any,
  ): Promise<userWithCompanyDto[]> {
    const users = await this.prisma.user.findMany({
      where: {
        CompanyUser: {
          some: {
            companyId: company.id,
            status: 'REJECTED',
          },
        },
      },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        email: true,
        CompanyUser: {
          where: {
            companyId: company.id,
          },
          select: {
            id: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      email: user.email,
      status: user.CompanyUser[0]?.status,
      companyUserId: user.CompanyUser[0].id,
      createdAt: user.CompanyUser[0]?.createdAt,
      updatedAt: user.CompanyUser[0]?.updatedAt,
    }));
  }

  async userCompanyDelete(
    data: CompanyUserDto,
    company: any,
  ): Promise<BaseResponseDto> {
    await this.prisma.companyUser.delete({
      where: {
        id: data.id,
        userId: data.userId,
        companyId: company.id,
      },
    });

    return {
      success: true,
      message: '삭제되었습니다.',
    };

  }
}
