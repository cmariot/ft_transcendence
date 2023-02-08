import { Controller, Get, UseGuards } from "@nestjs/common";
import { isLogged } from "./auth/guards/authentification.guards";
import { DoubleAuthGuard } from "./auth/guards/doubleauth.guards";
import { EmailGuard } from "./auth/guards/email.guards";

@Controller()
export class AppController {
    @Get("test/isLogged")
    @UseGuards(isLogged)
    async testLogged() {}

    @Get("test/doubleAuth")
    @UseGuards(DoubleAuthGuard)
    async testDoubleAuth() {}

    @Get("test/emailValidation")
    @UseGuards(EmailGuard)
    async testEmail() {}
}
