import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    Res,
    UseGuards,
} from "@nestjs/common";
import { RegisterDto } from "../dtos/register.dto";
import { AuthService } from "../services/auth.service";
import { UsersService } from "src/users/services/users.service";
import { emailValidationCodeDto } from "../dtos/emailValidationCode.dto";
import { EmailGuard } from "../guards/email.guards";

@Controller("register")
export class RegisterController {
    constructor(
        private userService: UsersService,
        private authService: AuthService
    ) {}

    // Use the form to register
    @Post()
    async register(@Body() register: RegisterDto, @Res() res, @Req() req) {
        const user = await this.authService.register(register);
        return this.authService.create_cookie(
            user,
            "email_validation",
            req,
            res
        );
    }

    // Validate your email after register
    @Post("validate")
    @UseGuards(EmailGuard)
    async validateEmail(
        @Req() req,
        @Body() codeDto: emailValidationCodeDto,
        @Res() res
    ) {
        const user = await this.authService.validate_email(
            req.user.uuid,
            codeDto.code
        );
        return this.authService.create_cookie(
            user,
            "authentification",
            req,
            res
        );
    }

    // Resend the validation code (+ change it before)
    @Get("resend")
    @UseGuards(EmailGuard)
    resend(@Req() req) {
        return this.authService.resendEmail(req.user.uuid);
    }

    // Cancel register
    @Get("cancel")
    @UseGuards(EmailGuard)
    async cancelRegister(@Req() req, @Res() res) {
        this.userService.deleteUser(req.user.uuid);
        const twelveHours = 1000 * 60 * 60 * 12;
        return res
            .clearCookie("email_validation", {
                maxAge: twelveHours,
                sameSite: "none",
                secure: true,
            })
            .send("Bye !");
    }
}
