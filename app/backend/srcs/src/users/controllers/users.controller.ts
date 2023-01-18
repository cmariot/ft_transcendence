import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { isLogged } from "src/auth/guards/is_logged.guards";

@Controller("")
export class UsersController {
    @UseGuards(isLogged)
    @Get("profile")
    profile(@Request() req) {
        return req.user;
    }
}
