import { Controller, Get, UseGuards } from "@nestjs/common";
import { User } from "./login/user.decorator";
import Profile from "passport-42";
import { AuthGuard } from "@nestjs/passport";

@Controller()
export class AppController {
  @Get()
  home(@User() user: Profile) {
    return { user };
  }

  @Get("test")
  @UseGuards(AuthGuard("42"))
  test() {
    return "Hello World!";
  }
}
