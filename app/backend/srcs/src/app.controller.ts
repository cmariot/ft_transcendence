import { Controller, Get } from "@nestjs/common";
import { User } from "./login/user.decorator";
import Profile from "passport-42";

@Controller()
export class AppController {
  @Get()
  home(@User() user: Profile) {
    return { user };
  }
}
