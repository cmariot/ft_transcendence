import { Strategy } from "passport-42";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Profile } from "passport";
import { User } from "src/users/entity/user.entity";
import { VerifyCallback } from "passport-42";
import { AuthService } from "../service/auth.service";

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, "42") {
  constructor(
    private configService: ConfigService,
    private authService: AuthService
  ) {
    super({
      clientID: configService.get<string>("UID_42_SECRET"),
      clientSecret: configService.get<string>("PASSWORD_SECRET_42"),
      callbackURL: configService.get<string>("CALLBACK_URL"),
      passReqToCallback: true,
    });
  }

  // In this example, the user's 42 profile is supplied as the profile
  // record. In a production-quality application, the 42 profile should
  // be associated with a user record in the application's database, which
  // allows for account linking and authentication with other identity
  // providers.
  async validate(
    request: { session: { accessToken: string } },
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    cb: VerifyCallback
  ): Promise<any> {
    request.session.accessToken = accessToken;
    let user: User = {
      id: parseInt(profile.id),
      username: profile.username,
      displayName: profile.displayName,
      email: profile.emails[0].value,
    };
    this.authService.validateUser(user, accessToken);
    return cb(null, profile);
  }
}
