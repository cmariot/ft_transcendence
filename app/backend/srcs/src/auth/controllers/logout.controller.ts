import { Controller, Get, Res } from "@nestjs/common";
import { AuthService } from "../services/auth.service";

@Controller("logout")
export class LogoutController {
    constructor(private authService: AuthService) {}

    @Get()
    logout(@Res() res): void {
        this.authService.logout(res);
    }
}
