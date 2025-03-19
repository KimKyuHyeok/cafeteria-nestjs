import {
  ConflictException,
  Injectable,
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
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { CompanyDto, CompanySearchDto } from './dto/company-search.dto';
import { CompanySearchInput } from './input/company-search.input';
import { CompanyUserInfo, MyPageInfoDto } from './dto/mypage-info.dto';
import { UserInfoUpdateInput } from './input/user-info-update.input';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async userSignin(data: UserSigninInput): Promise<Token> {
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
  }

  async userSignup(payload: UserSignupInput): Promise<Token> {
    payload.password = await this.passwordService.hashPassword(payload.password);

    const existingUser = await this.prisma.user.findFirst({
      where: { email: payload.email },
    });

    if (existingUser)
      throw new ConflictException('이미 가입된 이메일 입니다.');

    const user = await this.prisma.user.create({
      data: { ...payload },
    });

    return this.generateTokens({ userId: user.id });
  }

  async validateUser(userId: number): Promise<User> {
    return await this.prisma.user.findUnique({ where: { id: userId } });
  }

  async isValidateUser(user: any): Promise<Boolean> {
    const isValid = await this.prisma.user.findFirst({ where: { id: user.id }});
    
    return isValid ? true : false;
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
  }

  async companyListSearch(data: CompanySearchInput): Promise<CompanySearchDto> {
    const companies = await this.prisma.company.findMany({
      where: {
        companyName: {
          contains: data.keyword.toLowerCase(),
        },
      },
      skip: data.skip,
      take: data.take
    });

    const totalCount = await this.prisma.company.count({
      where: {
        companyName: { contains: data.keyword.toLowerCase() }
      }
    })

    const companyDtos: CompanyDto[] = companies.map(company => ({
      id: company.id,
      companyName: company.companyName,
      registrationNumber: company.registrationNumber
    }))

    return {
      companies: companyDtos,
      totalCount
    }
  }

  async myPageInfoSelect(user: any): Promise<MyPageInfoDto> {
    const { name, email, phoneNumber } = await this.prisma.user.findFirst({
      where: { id: user.id }
    })

    const companyUserList = await this.prisma.companyUser.findMany({
      where: { userId: user.id },
      include: {
        company: {
          select: {
            companyName: true, // companyName만 선택
          },
        },
      },
    })

    const companyUserInfo: CompanyUserInfo[] = companyUserList.map(companyUser => ({
      companyUserId: companyUser.id,
      companyName: companyUser.company.companyName,
      status: companyUser.status
    }))

    return {
      userInfo: {
        name, email, phoneNumber
      },
      companyUserInfo
    }
  }

  async myPageInfoUpdate(data: UserInfoUpdateInput, user: any) :Promise<BaseResponseDto> {
    if (data.password) {

      data.password = await this.passwordService.hashPassword(data.password);


      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          name: data.name,
          password: data.password,
          phoneNumber: data.phoneNumber,
        }
      })
    } else {
      console.log(data);
      await this.prisma.user.update({
        where: { id: user.id },
        data: { name: data.name, phoneNumber: data.phoneNumber }
      })
    }

    return {
      success: true,
      message: '내 정보가 성공적으로 변경되었습니다.'
    }
  }
}
