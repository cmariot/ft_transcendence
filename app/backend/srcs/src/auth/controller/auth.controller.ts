import { Controller, Get } from "@nestjs/common";
import { AuthService } from "../service/auth.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

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

  @Get("42")
  forty_two(): string {
    return this.authService.forty_two();
  }

  @Get("42/redirect")
  forty_two_redirect(): string {
    return this.authService.forty_two_redirection();
  }
}
