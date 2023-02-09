<<<<<<< HEAD
import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { UsersService } from "./users/services/users.service";
=======
import { Controller, Get, UseGuards } from "@nestjs/common";
>>>>>>> 68f5bd4c548d3da9f3202504c8f62258c7331607
import { isLogged } from "./auth/guards/authentification.guards";
import { DoubleAuthGuard } from "./auth/guards/doubleauth.guards";
import { EmailGuard } from "./auth/guards/email.guards";
import { Status } from "./users/entity/user.entity";

@Controller()
export class AppController {
	constructor(private userService: UsersService){}
    @Get("test/isLogged")
    @UseGuards(isLogged)
    async testLogged(@Req() req) {
		await this.userService.user_status(req.user.Username, Status.ONLINE);
		return req.user.username;
	}

    @Get("test/doubleAuth")
    @UseGuards(DoubleAuthGuard)
    async testDoubleAuth() {}

    @Get("test/emailValidation")
    @UseGuards(EmailGuard)
    async testEmail() {}
}
