import { Controller, Get, Redirect, UseGuards } from "@nestjs/common";
import { FtOauthGuard } from "./guards/ft-oauth.guard";

@Controller("login")
export class LoginController {
  @Get()
  @UseGuards(FtOauthGuard)
  login(): void {
    return;
  }

  @Get("callback")
  @UseGuards(FtOauthGuard)
  @Redirect("/")
  callback(): void {
    return;
  }
}
