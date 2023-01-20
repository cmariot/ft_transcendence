import {
    Controller,
    Get,
    Redirect,
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
    forty_two(): void {}

    // 42 Strategy redirects here, create a connexion cookie
    @Get("42/redirect")
    @UseGuards(FortyTwoOauthGuard)
    @Redirect("https://localhost:8443/")
    async forty_two_redirect(@Request() req, @Response() res) {
        let user = await this.authService.signin_or_register_42_user(req.user);
        if (user == null) {
            console.log("Invalid username");
            return null;
        }
        return this.authService.create_authentification_cookie(user, res);
    }
}
