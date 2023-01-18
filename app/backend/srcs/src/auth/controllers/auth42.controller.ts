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
import { Auth42Service } from "../services/auth.service";

@Controller("auth")
export class Auth42Controller {
    constructor(private authService: Auth42Service) {}

    // Use 42 strategy for Login
    @Get("42")
    @UseGuards(FortyTwoOauthGuard)
    forty_two(): void {
        return;
    }

    // 42 Strategy redirects here, create a connexion cookie
    @Get("42/redirect")
    @UseGuards(FortyTwoOauthGuard)
    forty_two_redirect(@Request() req, @Response() res) {
        if (!req.user)
            throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
        return this.authService.create_authentification_cookie(req, res);
    }
}
