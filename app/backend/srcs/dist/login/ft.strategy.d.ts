import { ConfigService } from "@nestjs/config";
import { Profile, VerifyCallback } from "passport-42";
import { LoginService } from "./login.service";
declare const FortyTwoStrategy_base: new (...args: any[]) => any;
export declare class FortyTwoStrategy extends FortyTwoStrategy_base {
    private readonly configService;
    private loginService;
    constructor(configService: ConfigService, loginService: LoginService);
    validate(accessToken: string, refreshToken: string, profile: Profile, cb: VerifyCallback): Promise<any>;
}
export {};
