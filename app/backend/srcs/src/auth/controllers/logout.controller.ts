import { Controller, Get, Req , Res, UseGuards} from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { UsersService } from "../../users/services/users.service";
@Controller("logout")

export class LogoutController {
    constructor(private authService: AuthService, private userService: UsersService) {}

    @Get()
    logout(@Res() res): void {
        this.authService.logout(res);
    }
}
