import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile, VerifyCallback } from "passport-42";

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, "42") {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>("UID_42_SECRET"),
      clientSecret: configService.get<string>("PASSWORD_SECRET_42"),
      callbackURL: "http://localhost:3000/login/callback",
      passReqToCallback: true,
    });
  }

  async validate(
    request: { session: { accessToken: string } },
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    cb: VerifyCallback
  ): Promise<any> {
    request.session.accessToken = accessToken;
    console.log("accessToken", accessToken, "refreshToken", refreshToken);
    // In this example, the user's 42 profile is supplied as the user
    // record.  In a production-quality application, the 42 profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    console.log(profile.username);
    console.log(profile.emails[0].value);
    return cb(null, profile);
  }
}
