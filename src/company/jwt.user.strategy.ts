import { UserService } from './../user/user.service';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { User } from 'src/user/models/user.model';

@Injectable()
export class JwtUserStrategy extends PassportStrategy(Strategy, 'user-jwt') {
    constructor(
        private readonly userService: UserService,
        private configService: ConfigService
        ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_ACCESS_SECRET')
        });
    }

    async validate(payload: any): Promise<User> {
        const user = await this.userService.validateUser(payload.userId);

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}