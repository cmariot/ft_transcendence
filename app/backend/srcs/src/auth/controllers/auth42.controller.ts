import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Request,
    Response,
    UseGuards,
} from "@nestjs/common";
import { FortyTwoOauthGuard } from "../guards/forty_two_oauth.guards";
import { AuthService } from "../services/auth.service";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    // Use 42 strategy for Login
    @Get("42")
    @UseGuards(FortyTwoOauthGuard)
    forty_two(): void {}

    // 42 Strategy redirects here, create a connexion cookie
    @Get("42/redirect")
    @UseGuards(FortyTwoOauthGuard)
    async forty_two_redirect(@Request() req, @Response() res) {
        let user = await this.authService.signin_or_register_42_user(
            req.user,
            res
        );
        if (user === null) {
            res.redirect("https://localhost:8443/unavailable-username");
            throw new HttpException(
                "This username is already registered, try to register manually",
                HttpStatus.NOT_FOUND
            );
        }
    }
}
