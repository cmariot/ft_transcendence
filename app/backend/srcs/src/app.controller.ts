import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Req,
    UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users/services/users.service";
import { isLogged } from "./auth/guards/authentification.guards";
import { DoubleAuthGuard } from "./auth/guards/doubleauth.guards";
import { EmailGuard } from "./auth/guards/email.guards";

@Controller()
export class AppController {
    constructor(private userService: UsersService) {}

    @Get("test/isLogged")
    @UseGuards(isLogged)
    async testLogged(@Req() req) {
        return "OK";
    }
    @Get("test/doubleAuth")
    //@UseGuards(DoubleAuthGuard)
    async testDoubleAuth(@Req() req) {
        return "OK";
    }
    @Get("test/emailValidation")
    @UseGuards(EmailGuard)
    async testEmail(@Req() req) {
        return "OK";
    }

    @Get(":username/image")
    @UseGuards(isLogged)
    getUserImage(@Param() params, @Req() req) {
        return this.userService.getProfileImage(req.user.uuid);
    }
}
