import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Post,
    Req,
    Res,
    UseGuards,
} from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { DoubleAuthGuard } from "../guards/doubleauth.guards";
import { emailValidationCodeDto } from "../dtos/emailValidationCode.dto";
import { UsersService } from "src/users/services/users.service";

@Controller("second_auth")
export class DoubleAuthController {
    constructor(
        private authService: AuthService,
        private userService: UsersService
    ) {}

    @Post()
    @UseGuards(DoubleAuthGuard)
    async verifyCode(
        @Req() req,
        @Body() codeDto: emailValidationCodeDto,
        @Res() res
    ) {
        const user = await this.userService.getProfile(req.user.uuid);
        if (codeDto.code === user.doubleAuthentificationCode) {
            if (user.doubleAuthentificationCode.length != 6) {
                throw new HttpException("Invalid Code.", HttpStatus.FORBIDDEN);
            }
            res.clearCookie("double_authentification");
            this.authService.create_cookie(user, "authentification", res);
            this.userService.delete2faCode(req.user.uuid);
            return "OK";
        }
        throw new HttpException("Validation failed.", HttpStatus.FORBIDDEN);
    }

    @Get("resend")
    @UseGuards(DoubleAuthGuard)
    async resend(@Req() req) {
        this.userService.generateDoubleAuthCode(req.user.uuid);
    }

    @Get("cancel")
    @UseGuards(DoubleAuthGuard)
    async cancel2fa(@Res() res) {
        res.clearCookie("double_authentification").send("Bye !");
    }
}
