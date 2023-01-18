import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Post,
    Req,
    Res,
} from "@nestjs/common";
import { LoginDto } from "../dtos/login.dto";
import { LoginService } from "../services/login.service";
import { Auth42Service } from "../services/auth.service";

@Controller("login")
export class LoginController {
    constructor(
        private loginService: LoginService,
        private authService: Auth42Service
    ) {}

    @Post()
    login(@Body() loginDto: LoginDto, @Req() req, @Res() res) {
        req.user = this.loginService.login(loginDto);
        if (req.user === null) {
            throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
        }
        return this.authService.create_authentification_cookie(req.user, res);
    }
}
