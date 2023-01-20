import {
    Body,
    Controller,
    Post,
    Res,
    UnauthorizedException,
} from "@nestjs/common";
import { RegisterDto } from "../dtos/register.dto";
import { Auth42Service } from "../services/auth.service";
import { UsersService } from "src/users/services/users.service";
import { UserEntity } from "src/users/entity/user.entity";
import { JwtService } from "@nestjs/jwt";

@Controller("register")
export class RegisterController {
    constructor(
        private userService: UsersService,
        private authService: Auth42Service
    ) {}

    @Post()
    async register(@Body() registerDto: RegisterDto,  @Res() res) {
        let user = await this.userService.register(registerDto);
        if (!user) {
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
