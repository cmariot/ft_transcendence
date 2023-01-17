import { Strategy } from "passport-42";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Profile } from "passport";
import { AuthService } from "../service/auth.service";
import { CreatedFrom, UserEntity } from "src/users/entity/user.entity";

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, "42") {
    constructor(private authService: AuthService) {
        super({
            clientID: process.env.UID_42_SECRET,
            clientSecret: process.env.PASSWORD_SECRET_42,
            callbackURL: process.env.CALLBACK_URL,
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile
    ) {
        let user: UserEntity = await this.authService.validateUser({
            username: profile.username,
            email: profile.emails[0].value,
            createdFrom: CreatedFrom.OAUTH42,
        });
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
