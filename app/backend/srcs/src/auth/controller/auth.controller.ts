import { Controller, Get, Redirect, UseGuards } from "@nestjs/common";
import { FortyTwoOauthGuard } from "../guards/forty_two_oauth.guards";
import { AuthService } from "../service/auth.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get("42")
  @UseGuards(FortyTwoOauthGuard)
  forty_two(): void {
    return this.authService.forty_two();
  }

  @Get("42/redirect")
  @UseGuards(FortyTwoOauthGuard)
  forty_two_redirect(): void {
    return this.authService.forty_two_redirection();
  }

  @Get("login/success")
  login_success(): string {
    return this.authService.login_success();
  }

  @Get("login/failure")
  login_failure(): string {
    return this.authService.login_failure();
  }

  @Get("logout")
  logout(): string {
    return this.authService.logout();
  }
}
