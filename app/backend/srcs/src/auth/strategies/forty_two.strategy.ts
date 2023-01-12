import { Strategy } from "passport-42";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../service/auth.service";
import { ConfigService } from "@nestjs/config";
import { Profile } from "passport";
import { VerifyCallback } from "passport-jwt";
import { UsersService } from "src/users/services/users/users.service";

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, "42") {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private configService: ConfigService
  ) {
    super({
      clientID: configService.get<string>("UID_42_SECRET"),
      clientSecret: configService.get<string>("PASSWORD_SECRET_42"),
      callbackURL: configService.get<string>("CALLBACK_URL"),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    cb: VerifyCallback
  ): Promise<any> {
    //console.log("accessToken", accessToken, "refreshToken", refreshToken);
    //console.log("profile", profile);

    // In this example, the user's 42 profile is supplied as the profile
    // record. In a production-quality application, the 42 profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    let user = {
      username: profile.username,
      displayName: profile.displayName,
      email: profile.emails[0].value,
    };

    let created_user = this.authService.validateUser(user, accessToken);
    if (!created_user) {
      throw new UnauthorizedException();
    }
    return created_user;
  }
}
