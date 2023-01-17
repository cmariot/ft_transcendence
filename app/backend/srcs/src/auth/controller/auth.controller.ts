import {
  Controller,
  Get,
  Request,
  Res,
  Response,
  UseGuards,
} from "@nestjs/common";
import { FortyTwoOauthGuard } from "../guards/forty_two_oauth.guards";
import { AuthService } from "../service/auth.service";
import { JwtAuthGuard } from "../guards/jwt_auth.guards";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  // Use 42 strategy for Login
  @Get("42")
  @UseGuards(FortyTwoOauthGuard)
  forty_two(): void {
    return;
  }

  // 42 Strategy redirects here, create a connexion cookie
  @Get("42/redirect")
  @UseGuards(FortyTwoOauthGuard)
  forty_two_redirect(@Request() req, @Response() res) {
   return this.authService.create_authentification_cookie(req, res);
  }

  // Protected route, need to be connected to get this
  @Get("test")
  @UseGuards(JwtAuthGuard)
  test(): string {
    return "You see that because you're logged in !";
  }

  @Get("logout")
  @UseGuards(JwtAuthGuard)
  logout(@Res() res): void {
    res.clearCookie("authentification").redirect("https://localhost:4242/");
  }
}
