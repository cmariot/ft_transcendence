import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Req,
    UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users/services/users.service";
import { isLogged } from "./auth/guards/is_logged.guards";
import { UserEntity } from "./users/entity/user.entity";

@Controller()
export class AppController {
    constructor(private userService: UsersService) {}

    @Get()
    @UseGuards(isLogged)
    async test(@Req() req) {
        let user: UserEntity = await this.userService.getProfile(req.user.uuid);
        if (user === null) {
            throw new HttpException(
                "Invalid user account.",
                HttpStatus.UNAUTHORIZED
            );
        }
        if (user.valideEmail === false) {
            throw new HttpException(
                "Your email is not valid.",
                HttpStatus.UNAUTHORIZED
            );
        } else if (user.twoFactorsAuth === true) {
            console.log("2FA");
        }
        return "OK";
    }

    @Get(":username/image")
    @UseGuards(isLogged)
    findOne(@Param() params, @Req() req) {
        return this.userService.getProfileImage(req.user.uuid);
    }
}
