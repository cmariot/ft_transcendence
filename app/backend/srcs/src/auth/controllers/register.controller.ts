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
import { RegisterDto } from "../dtos/register.dto";
import { AuthService } from "../services/auth.service";
import { UsersService } from "src/users/services/users.service";
import { UserEntity } from "src/users/entity/user.entity";
import { isLogged } from "../guards/is_logged.guards";
import { emailValidationCodeDto } from "../dtos/emailValidationCode.dto";

@Controller("register")
export class RegisterController {
    constructor(
        private userService: UsersService,
        private authService: AuthService
    ) {}

    @Post()
    async register(@Body() registerDto: RegisterDto, @Res() res) {
        let user: UserEntity = await this.userService.register(registerDto);
        this.authService.create_validation_cookie(user, res);
        return "OK";
    }

    @Get("resend")
    @UseGuards(isLogged)
    async resend(@Req() req) {
        this.userService.resendEmail(req.user.uuid);
    }

    @Post("validate")
    @UseGuards(isLogged)
    async validateEmail(@Body() codeDto: emailValidationCodeDto, @Req() req) {
        const user = await this.userService.getProfile(req.user.uuid);
        if (codeDto.code === user.emailValidationCode) {
            await this.userService.validateEmail(user.uuid);
            return "OK";
        }
        throw new HttpException("Validation failed.", HttpStatus.FORBIDDEN);
    }

    @Get("cancel")
    @UseGuards(isLogged)
    async cancelRegister(@Req() req, @Res() res) {
        this.userService.deleteUser(req.user.uuid);
        res.clearCookie("authentification").send("Bye !");
    }
}
