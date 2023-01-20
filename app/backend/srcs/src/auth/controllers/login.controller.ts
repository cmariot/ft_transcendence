import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import { LoginDto } from "../dtos/login.dto";
import { LoginService } from "../services/login.service";
import { Auth42Service } from "../services/auth.service";
import { UserEntity } from "src/users/entity/user.entity";

@Controller("login")
export class LoginController {
    constructor(
        private loginService: LoginService,
        private authService: Auth42Service
    ) {}

    @Post()
    async login(@Body() loginDto: LoginDto, @Req() req, @Res() res) {
        let user: UserEntity = await this.loginService.signin_local_user(
            loginDto
        );
        if (user === null) {
            return null;
        }
        return this.authService.create_authentification_cookie(req.user, res);
    }
}
