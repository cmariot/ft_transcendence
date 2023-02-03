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
import { RegisterDto } from "../dtos/register.dto";
import { AuthService } from "../services/auth.service";
import { UsersService } from "src/users/services/users.service";
import { UserEntity } from "src/users/entity/user.entity";
import { emailValidationCodeDto } from "../dtos/emailValidationCode.dto";
import { EmailGuard } from "../guards/email.guards";

@Controller("register")
export class RegisterController {
    constructor(
        private userService: UsersService,
        private authService: AuthService
    ) {}

    @Post()
    async register(@Body() registerDto: RegisterDto, @Res() res) {
        let user: UserEntity = await this.userService.register(registerDto);
        if (user) {
            return this.authService.create_cookie(
                user,
                "email_validation",
                res
            );
        }
        throw new HttpException(
            "Cannot register, please try again.",
            HttpStatus.NO_CONTENT
        );
    }

    @Post("validate")
    @UseGuards(EmailGuard)
    async validateEmail(
        @Req() req,
        @Body() codeDto: emailValidationCodeDto,
        @Res() res
    ) {
        const user = await this.userService.getProfile(req.user.uuid);
        if (codeDto.code === user.emailValidationCode) {
            const now = new Date();
            const diff =
                now.valueOf() - user.emailValidationCodeCreation.valueOf();
            if (diff > 1000 * 60 * 15) {
                // 15 minutes expiration date
                this.userService.resendEmail(req.user.uuid);
                throw new UnauthorizedException(
                    "Your code is expired, we send you a new code."
                );
            }
            if (user.emailValidationCode.length != 6) {
                throw new HttpException("Invalid Code.", HttpStatus.FORBIDDEN);
            }
            await this.userService.validateEmail(user.uuid);
            res.clearCookie("email_validation");
            this.authService.create_cookie(user, "authentification", res);
            this.userService.deleteEmailValidationCode(req.user.uuid);
            return "OK";
        }
        throw new HttpException("Validation failed.", HttpStatus.FORBIDDEN);
    }

    @Get("resend")
    @UseGuards(EmailGuard)
    async resend(@Req() req) {
        this.userService.resendEmail(req.user.uuid);
    }

    @Get("cancel")
    @UseGuards(EmailGuard)
    async cancelRegister(@Req() req, @Res() res) {
        this.userService.deleteUser(req.user.uuid);
        res.clearCookie("email_validation").send("Bye !");
    }
}
