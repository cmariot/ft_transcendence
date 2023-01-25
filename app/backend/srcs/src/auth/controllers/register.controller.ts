import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Post,
    Res,
    UnauthorizedException,
} from "@nestjs/common";
import { RegisterDto } from "../dtos/register.dto";
import { AuthService } from "../services/auth.service";
import { UsersService } from "src/users/services/users.service";

@Controller("register")
export class RegisterController {
    constructor(
        private userService: UsersService,
        private authService: AuthService
    ) {}

    @Post()
    async register(@Body() registerDto: RegisterDto, @Res() res) {
        let user = await this.userService.register(registerDto);
        if (!user) {
            throw new HttpException
            ('This username is already registered.', HttpStatus.NOT_ACCEPTABLE);
        }
        this.authService.create_authentification_cookie(
            user,
            res,
            "https://localhost:8443/"
        );
    }
}
