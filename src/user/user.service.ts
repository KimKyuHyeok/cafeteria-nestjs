import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { PasswordService } from 'src/common/auth/password.service';
import { JwtService } from '@nestjs/jwt';
import { UserSignupInput } from './input/user-signup.input';
import { Token } from 'src/common/auth/model/token.model';
import { User } from './models/user.model';
import { UserSigninInput } from './input/user-signin.input';
import { CompanyUserJoinRequestDto } from './dto/company-user-join.request';
import { Company } from 'src/company/model/company.model';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async userSignin(data: UserSigninInput): Promise<Token> {
    try {
      const user = await this.prisma.user.findFirst({
        where: { email: data.email },
      });

      if (!user) throw new UnauthorizedException('해당 이메일로 등록된 사용자가 없습니다.');

      const passwordValid = await this.passwordService.validatePassword(
        data.password,
        user.password,
      );

      if (!passwordValid) throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');

      return this.generateTokens({ userId: user.id });
    } catch (error) {
      console.error('User Sign in Error :', error);
      
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('로그인 중 문제가 발생했습니다.')
    }
  }

  async userSignup(payload: UserSignupInput): Promise<Token> {
    payload.password = await this.passwordService.hashPassword(payload.password);

    try {
      const existingUser = await this.prisma.user.findFirst({
        where: { email: payload.email },
      });

      if (existingUser)
        throw new ConflictException('이미 가입된 이메일 입니다.');

      const user = await this.prisma.user.create({
        data: { ...payload },
      });

      return this.generateTokens({ userId: user.id });
    } catch (error) {
      console.error('User Signup Error :', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('회원가입 중 문제가 발생했습니다.');
    }
  }

  validateUser(userId: number): Promise<User> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  private generateTokens(payload: { userId: number }): Token {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: { userId: number }): string {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '24h',
    });
  }

  private generateRefreshToken(payload: { userId: number }): string {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
  }

  async companyUserJoinRequest(
    dto: CompanyUserJoinRequestDto,
    user: any,
  ): Promise<BaseResponseDto> {
    try {
      const existingCompanyUser = await this.prisma.companyUser.findFirst({
        where: {
          companyId: dto.companyId,
          userId: user.id,
        },
      });

      if (existingCompanyUser) throw new ConflictException('이미 신청했거나 승인거절 상태입니다.');

      await this.prisma.companyUser.create({
        data: {
          company: { connect: { id: dto.companyId } },
          user: { connect: { id: user.id } },
          status: 'PENDING',
        },
      });

      return {
        success: true,
        message: '신청이 완료되었습니다.',
      };
    } catch (error) {
      console.error('Company User Join Request Error :', error);

      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('회사 사용자 신청 중 문제가 발생했습니다.');
    }
  }

  async companyListSearch(keyword: string): Promise<Company[]> {
    return await this.prisma.company.findMany({
      where: {
        companyName: {
          contains: keyword.toLowerCase(),
        },
      },
    });
  }
  
  
}
