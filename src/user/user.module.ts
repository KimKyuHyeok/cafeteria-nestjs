import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { PasswordService } from 'src/common/auth/password.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [UserService, UserResolver, PasswordService, JwtService],
})
export class UserModule {}
