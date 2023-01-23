import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { isLogged } from "src/auth/guards/is_logged.guards";

@Controller("")
export class UsersController {
    @Get("profile")
    @UseGuards(isLogged)
    profile(@Request() req) {
        return req.user;
    }
}
