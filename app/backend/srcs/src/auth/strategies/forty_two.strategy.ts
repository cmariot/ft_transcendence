import { Strategy } from "passport-42";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { Profile } from "passport";
import { CreatedFrom } from "src/users/entity/user.entity";

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, "42") {
    constructor() {
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
        return {
            id42: profile.id,
            username: profile.username,
            email: profile.emails[0].value,
            createdFrom: CreatedFrom.OAUTH42,
            password: null,
            twoFactorsAuth: true,
            valideEmail: true,
        };
    }
}
