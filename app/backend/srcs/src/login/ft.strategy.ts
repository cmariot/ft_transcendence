import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile, VerifyCallback } from "passport-42";
import { LoginService } from "./login.service";

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, "42") {
  // A set of options that are specific to that strategy.
  // For example, in a JWT strategy, you might provide a secret to sign tokens.
  constructor(
    private readonly configService: ConfigService,
    private loginService: LoginService
  ) {
    super({
      clientID: configService.get<string>("UID_42_SECRET"),
      clientSecret: configService.get<string>("PASSWORD_SECRET_42"),
      callbackURL: configService.get<string>("CALLBACK_ADDRESS"),
    });
  }

  // A "verify callback", which is where you tell Passport how to interact with your user store
  // (where you manage user accounts).
  // Here, you verify whether a user exists (and/or create a new user),
  // and whether their credentials are valid.
  // The Passport library expects this callback to return a full user if the validation succeeds,
  // or a null if it fails (failure is defined as either the user is not found,
  // or, in the case of passport-local, the password does not match).
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    cb: VerifyCallback
  ): Promise<any> {
    // In this example, the user's 42 profile is supplied as the user
    // record.  In a production-quality application, the 42 profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile.username);
    console.log(profile.emails[0].value);
    // If a user is found and the credentials are valid, the user is returned
    // so Passport can complete its tasks (e.g., creating the user property on the Request object),
    // and the request handling pipeline can continue.
    // If it's not found, we throw an exception and let our exceptions layer handle it.
    const user = await this.loginService.validateUser(profile.username);
    if (user) {
      return user;
    } else if (!user) {
      throw new UnauthorizedException();
    }
    return cb(null, user);
  }
}
