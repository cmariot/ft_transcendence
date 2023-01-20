import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginService } from "../services/login.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private loginService: LoginService) {
        super();
    }

    async validate(username: string, password: string): Promise<any> {
        const user = await this.loginService.signin_local_user(username, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
