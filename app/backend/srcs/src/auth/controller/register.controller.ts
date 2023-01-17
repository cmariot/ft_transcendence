import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "../service/auth.service";
import { RegisterDto } from "../dto/register.dto";
import { RegisterService } from "../service/register.service";
import { UserEntity } from "src/users/entity/user.entity";

@Controller("register")
export class RegisterController {
    constructor(private registerService: RegisterService) {}

    @Post()
    register(@Body() registerDto: RegisterDto): Promise<UserEntity> {
        return this.registerService.validate(registerDto);
    }
}
