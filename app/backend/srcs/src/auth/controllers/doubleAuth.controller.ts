import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Post,
    Req,
    Res,
    UnauthorizedException,
    UseGuards,
} from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { DoubleAuthGuard } from "../guards/doubleauth.guards";
import { emailValidationCodeDto } from "../dtos/emailValidationCode.dto";
import { UsersService } from "src/users/services/users.service";

@Controller("secondauth")
export class DoubleAuthController {
    constructor(
        private authService: AuthService,
        private userService: UsersService
    ) {}

    // 2fa code validation
    @Post()
    @UseGuards(DoubleAuthGuard)
    async verifyCode(
        @Req() req,
        @Body() codeDto: emailValidationCodeDto,
        @Res() res
    ) {
        let user = await this.userService.getByID(req.user.uuid);
        if (!user) throw new UnauthorizedException("User not found");
        if (codeDto.code === user.doubleAuthentificationCode) {
            const now: Date = new Date();
            const fifteenMinutes: number = 1000 * 60 * 15;
            const diff: number = now.valueOf() - user.date2fa.valueOf();
            if (diff > fifteenMinutes) {
                throw new UnauthorizedException(
                    "Your code is expired, try to relog."
                );
            }
            if (user.doubleAuthentificationCode.length != 6) {
                throw new HttpException("Invalid Code.", HttpStatus.FORBIDDEN);
            }
            return await this.authService.create_cookie(
                user,
                "authentification",
                req,
                res
            );
        }
        throw new HttpException("Validation failed.", HttpStatus.FORBIDDEN);
    }

    // resend the 2fa code
    @Get("resend")
    @UseGuards(DoubleAuthGuard)
    async resend(@Req() req) {
        let user = await this.userService.getByID(req.user.uuid);
        if (!user) throw new UnauthorizedException("User not found.");
        const now: Date = new Date();
        const oneMinute: number = 1000 * 60;
        const diff: number = now.valueOf() - user.date2fa.valueOf();
        if (diff < oneMinute) {
            throw new UnauthorizedException("Don't spam.");
        }
        return await this.authService.generateDoubleAuthCode(req.user.uuid);
    }

    // cancel login
    @Get("cancel")
    @UseGuards(DoubleAuthGuard)
    async cancel2fa(@Res() res) {
        const twelveHours = 1000 * 60 * 60 * 12;
        res.clearCookie("double_authentification", {
            maxAge: twelveHours,
            sameSite: "none",
            secure: true,
        }).send("Bye !");
    }
}
