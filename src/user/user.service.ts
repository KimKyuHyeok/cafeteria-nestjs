import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { PasswordService } from 'src/common/auth/password.service';
import { JwtService } from '@nestjs/jwt';
import { UserSignupInput } from './dto/user-signup.input';
import { Token } from 'src/common/auth/model/token.model';
import { User } from './models/user.model';
import { UserSigninInput } from './dto/user-signin.input';
import { CompanyUserResponse } from 'src/company/dto/companyUser.response';
import { CompanyUserJoinRequestDto } from './dto/companyUserJoinRequest.dto';
import { Company } from 'src/company/model/company.model';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService
  ) {}

  async signin(data: UserSigninInput): Promise<Token> {

    try {
      const user = await this.prisma.user.findFirst({ where: { email: data.email }})

      const passwordValid = await this.passwordService.validatePassword(data.password, user.password);

      if (!passwordValid) throw new BadRequestException('비밀번호가 일치하지 않습니다.');

      return this.generateTokens({
        userId: user.id
      })
    } catch (error) {
      console.error(error);
    }
  }

  async signup(payload: UserSignupInput): Promise<Token> {
    payload.password = await this.passwordService.hashPassword(payload.password)

    try {
      const check = await this.prisma.user.findMany({
        where: { email: payload.email }
      })

      if (check.length > 0) throw new ConflictException('이미 가입된 이메일 입니다.');

      const user = await this.prisma.user.create({
        data: {
          ...payload
        }
      })

      return this.generateTokens({
        userId: user.id
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error('An unexpected error occurred during user creation.');
    }
  }

  validateUser(userId: number): Promise<User> {
    return this.prisma.user.findUnique({ where: { id: userId }})
  }

  private generateTokens(payload: { userId: number }): Token {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload)
    }
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
  
  async companyUserJoinRequest(dto: CompanyUserJoinRequestDto, user: any): Promise<CompanyUserResponse> {
    
    try {
      const check = await this.prisma.companyUser.findMany({
        where: {
          companyId: dto.companyId,
          userId: user.id
        }
      })

      if (check.length > 0) throw new ConflictException('이미 신청했거나 승인거절 상태입니다.');

      await this.prisma.companyUser.create({
        data: {
          company: { connect: { id: dto.companyId }},
          user: { connect: { id: user.id }},
          status: 'PENDING'
        }
      })

      return {
        success: true,
        message: '신청이 완료되었습니다.'
      }
    } catch (error) {
      return {
        success: false,
        message: error
      }
    }
  }

  async companyListSearch(keyword: string): Promise<Company[]> {
    return await this.prisma.company.findMany({
      where: {
        name: {
          contains: keyword
        }
      }
    })
  }
  

}
