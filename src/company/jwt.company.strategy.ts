import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { CompanyService } from './company.service';
import { Company } from './model/company.model';

@Injectable()
export class JwtCompanyStrategy extends PassportStrategy(
  Strategy,
  'company-jwt',
) {
  constructor(
    private readonly companyService: CompanyService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: any): Promise<Company> {
    const company = await this.companyService.validateCompany(
      payload.companyId,
    );

    if (!company) {
      throw new UnauthorizedException();
    }

    return company;
  }
}
