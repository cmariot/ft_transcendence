import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import { LoginDto } from "../dtos/login.dto";
import { AuthService } from "../services/auth.service";

@Controller("login")
export class LoginController {
    constructor(private authService: AuthService) {}

    // login with username/password
    @Post()
    async login(@Body() loginDto: LoginDto, @Res() res, @Req() req) {
        return this.authService.signin_local_user(loginDto, req, res);
    }
}
