import {
    Body,
    Controller,
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
        console.log("User pass DoubleAuth guard : OK !");
        console.log(codeDto.code);
        const user = await this.userService.getProfile(req.user.uuid);
        console.log("CODE DTO = ", codeDto.code);
        console.log("CODE user = ", user.doubleAuthentificationCode);
        if (codeDto.code === user.doubleAuthentificationCode) {
            //await this.userService.validateEmail(user.uuid);
            console.log("CODE OK");
            res.clearCookie("double_authentification");
            this.authService.create_cookie(user, "authentification", res);
            return "OK";
        }
        throw new HttpException("Validation failed.", HttpStatus.FORBIDDEN);
    }
}

// INSPI REGISTER
//    @Post("validate")
//    @UseGuards(EmailGuard)
//    async validateEmail(
//        @Req() req,
//        @Body() codeDto: emailValidationCodeDto,
//        @Res() res
//    ) {
//        const user = await this.userService.getProfile(req.user.uuid);
//        if (codeDto.code === user.emailValidationCode) {
//            await this.userService.validateEmail(user.uuid);
//            res.clearCookie("email_validation");
//            this.authService.create_cookie(user, "authentification", res);
//            return "OK";
//        }
//        throw new HttpException("Validation failed.", HttpStatus.FORBIDDEN);
//    }
//
//    @Get("resend")
//    @UseGuards(EmailGuard)
//    async resend(@Req() req) {
//        this.userService.resendEmail(req.user.uuid);
//    }
//
//    @Get("cancel")
//    @UseGuards(EmailGuard)
//    async cancelRegister(@Req() req, @Res() res) {
//        this.userService.deleteUser(req.user.uuid);
//        res.clearCookie("email_validation").send("Bye !");
//    }
