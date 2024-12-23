import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { CompanyService } from "./company.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly companyService: CompanyService,
        private configService: ConfigService
        ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_ACCESS_SECRET')
        });
    }

    async validate(payload: any) {
        const user = await this.companyService.validateCompany(payload.companyId);

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}