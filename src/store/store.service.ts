import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';
import { PasswordService } from 'src/common/auth/password.service';
import { StoreInput } from './dto/store-input.dto';
import { Token } from 'src/common/auth/model/token.model';
import { Store } from './model/store.modle';

@Injectable()
export class StoreService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async storeSignin(data: StoreInput): Promise<Token> {

    const store = await this.prisma.store.findFirst({
      where: { email: data.email },
    });

    const passwordValid = await this.passwordService.validatePassword(
      data.password,
      store.password,
    );

    if (!passwordValid)
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');

    return this.generateTokens({
      storeId: store.id,
    });
  }

  async storeSignup(data: StoreInput): Promise<Token> {
    data.password = await this.passwordService.hashPassword(data.password);

    const existingStore = await this.prisma.store.findFirst({
      where: { name: data.email },
    });

    if (existingStore)
      throw new ConflictException('이미 가입된 이메일 입니다.');

    const store = await this.prisma.store.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.password,
      },
    });

    return this.generateTokens({
      storeId: store.id,
    });
  }

  validateStore(storeId: number): Promise<Store> {
    return this.prisma.store.findUnique({ where: { id: storeId } });
  }

  private generateTokens(payload: { storeId: number }): Token {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: { storeId: number }): string {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '18h',
    });
  }

  private generateRefreshToken(payload: { storeId: number }): string {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '7d',
    });
  }
}
