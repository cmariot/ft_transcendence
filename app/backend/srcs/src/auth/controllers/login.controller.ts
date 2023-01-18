import { Body, Controller, Post } from "@nestjs/common";
import { LoginDto } from "../dtos/login.dto";
import { LoginService } from "../services/login.service";

@Controller("login")
export class LoginController {
    constructor(private loginService: LoginService) {}

    @Post()
    login(@Body() loginDto: LoginDto) {
        return this.loginService.login(loginDto);
    }
}
