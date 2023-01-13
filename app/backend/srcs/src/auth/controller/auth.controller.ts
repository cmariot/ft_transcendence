import { Controller, Get, Redirect, UseGuards } from "@nestjs/common";
import { FortyTwoOauthGuard } from "../guards/forty_two_oauth.guards";
import { AuthService } from "../service/auth.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get("42")
  @UseGuards(FortyTwoOauthGuard)
  forty_two(): void {
    console.log("forty_two");
    return;
  }

  @Get("42/redirect")
  @UseGuards(FortyTwoOauthGuard)
  @Redirect("/auth/login/success")
  forty_two_redirect(): void {
    console.log("forty_two_redirect");
    return;
  }

  @Get("login/success")
  login_success(): string {
    console.log("login_success");
    return this.authService.login_success();
  }

}
