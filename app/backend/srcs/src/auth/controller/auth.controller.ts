import { Controller, Get, Redirect, Request, UseGuards } from "@nestjs/common";
import { FortyTwoOauthGuard } from "../guards/forty_two_oauth.guards";
import { AuthService } from "../service/auth.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get("42")
  @UseGuards(FortyTwoOauthGuard)
  forty_two(): void {
    return;
  }

  @Get("42/redirect")
  @UseGuards(FortyTwoOauthGuard)
  forty_two_redirect(@Request() req) {
    return this.authService.login(req.user);
  }
}
