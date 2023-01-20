import { Body, Controller, Post, Res } from "@nestjs/common";
import { RegisterDto } from "../dtos/register.dto";
import { RegisterService } from "../services/register.service";
import { UserEntity } from "src/users/entity/user.entity";
import { Auth42Service } from "../services/auth.service";

@Controller("register")
export class RegisterController {
    constructor(
        private authService: Auth42Service,
        private registerService: RegisterService
    ) {}

    @Post()
    async register(
        @Body() registerDto: RegisterDto,
        @Res() res: Response
    ): Promise<UserEntity> {
        let user = await this.registerService.register(registerDto);
        if (user === null) {
            console.log("Cannot register: Username already in use.");
            return null;
        }
        return this.authService.create_authentification_cookie(user, res);
    }
}
