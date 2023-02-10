import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { UsersService } from "./users/services/users.service";
import { isLogged } from "./auth/guards/authentification.guards";
import { DoubleAuthGuard } from "./auth/guards/doubleauth.guards";
import { EmailGuard } from "./auth/guards/email.guards";

@Controller()
export class AppController {
    constructor(private userService: UsersService) {}
    @Get("authorization/logged")
    @UseGuards(isLogged)
    async testLogged(@Req() req) {
        return req.user.username;
    }

    @Get("authorization/double-authentification")
    @UseGuards(DoubleAuthGuard)
    async testDoubleAuth() {}

    @Get("authorization/email")
    @UseGuards(EmailGuard)
    async testEmail() {}
}
