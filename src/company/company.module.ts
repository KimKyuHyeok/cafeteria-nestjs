import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyResolver } from './company.resolver';
import { PasswordService } from 'src/common/auth/password.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [CompanyService, CompanyResolver, PasswordService, JwtService],
})
export class CompanyModule {}
