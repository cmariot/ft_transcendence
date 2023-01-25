import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Post,
    Res,
} from "@nestjs/common";
import { RegisterDto } from "../dtos/register.dto";
import { AuthService } from "../services/auth.service";
import { UsersService } from "src/users/services/users.service";
import { UserEntity } from "src/users/entity/user.entity";

@Controller("register")
export class RegisterController {
    constructor(
        private userService: UsersService,
        private authService: AuthService
    ) {}

    @Post()
    async register(@Body() registerDto: RegisterDto, @Res() res) {
        let user : UserEntity = await this.userService.register(registerDto);
        return (this.authService.create_authentification_cookie(
            user,
            res
        ));
    }
}
