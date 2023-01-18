import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Post,
} from "@nestjs/common";
import { RegisterDto } from "../dtos/register.dto";
import { RegisterService } from "../services/register.service";
import { UserEntity } from "src/users/entity/user.entity";

@Controller("register")
export class RegisterController {
    constructor(private registerService: RegisterService) {}

    @Post()
    async register(@Body() registerDto: RegisterDto): Promise<UserEntity> {
        let user: UserEntity = await this.registerService.register(registerDto);
        if (!user) throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
        return user;
    }
}
