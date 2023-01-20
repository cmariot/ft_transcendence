import {
    Body,
    Controller,
    Post,
    Req,
    Res,
    UnauthorizedException,
} from "@nestjs/common";
import { LoginDto } from "../dtos/login.dto";
import { LoginService } from "../services/login.service";
import { UserEntity } from "src/users/entity/user.entity";
import { Auth42Service } from "../services/auth.service";

@Controller("login")
export class LoginController {
    constructor(
        private loginService: LoginService,
        private authService: Auth42Service
    ) {}

    @Post()
    async login(@Body() loginDto: LoginDto, @Res() res) {
        let user: UserEntity = await this.loginService.signin_local_user(
            loginDto.username,
            loginDto.password
        );
        if (user === null) {
            throw new UnauthorizedException();
        }
        let authentification_value: string = this.authService.generate_jwt_token(user);
        res.cookie("authentification", authentification_value, {
            maxAge: 1000 * 60 * 60 * 2, // 2 hours
            httpOnly: true,
            sameSite: "none",
            secure: true,
        }).send(user.username);
    }
}
