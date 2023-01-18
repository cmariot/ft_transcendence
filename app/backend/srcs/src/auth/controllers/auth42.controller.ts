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
import { UserEntity } from "src/users/entity/user.entity";

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
    async forty_two_redirect(@Request() req, @Response() res) {
        let user = await this.authService.register_42_user(req.user);
        if (user) {
            return this.authService.create_authentification_cookie(user, res);
        }
        res.redirect("https://localhost:8443/");
    }
}
