import {
    Body,
    Controller,
    Post,
    Res,
    UnauthorizedException,
} from "@nestjs/common";
import { LoginDto } from "../dtos/login.dto";
import { UserEntity } from "src/users/entity/user.entity";
import { AuthService } from "../services/auth.service";

@Controller("login")
export class LoginController {
    constructor(private authService: AuthService) {}

    @Post()
    async login(@Body() loginDto: LoginDto, @Res() res) {
        let user: UserEntity = await this.authService.signin_local_user(
            loginDto.username,
            loginDto.password,
            res
        );
        if (user === null) {
            throw new UnauthorizedException();
        }
    }
}
