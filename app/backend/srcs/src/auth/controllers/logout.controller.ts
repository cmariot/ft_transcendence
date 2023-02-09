import { Controller, Get, Req , Res, UseGuards} from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { UsersService } from "../../users/services/users.service";
@Controller("logout")

export class LogoutController {
    constructor(private authService: AuthService, private userService: UsersService) {}

    @Get()
    logout(@Req() req, @Res() res): void {
		console.log(req);
        this.authService.logout(res);
    }
}
