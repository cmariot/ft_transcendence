import { Strategy } from "passport-42";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { Profile } from "passport";
import { Auth42Service } from "../services/auth.service";
import { CreatedFrom, UserEntity } from "src/users/entity/user.entity";

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, "42") {
    constructor(private authService: Auth42Service) {
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
        let user = {
            id42: profile.id,
            username: profile.username,
            email: profile.emails[0].value,
            createdFrom: CreatedFrom.OAUTH42,
            password: null,
        };
        return user;
    }
}
