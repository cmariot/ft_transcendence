import {
    Body,
    Controller,
    Post,
    Res,
} from "@nestjs/common";
import { LoginDto } from "../dtos/login.dto";
import { AuthService } from "../services/auth.service";

@Controller("login")
export class LoginController {
    constructor(private authService: AuthService) {}

    @Post()
    async login(@Body() loginDto: LoginDto, @Res() res) {
        console.log(loginDto)
        return this.authService.signin_local_user(
            loginDto.username,
            loginDto.password,
            res
        );
    }
}
