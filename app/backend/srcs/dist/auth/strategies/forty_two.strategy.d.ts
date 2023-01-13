import { ConfigService } from "@nestjs/config";
import { Profile } from "passport";
import { VerifyCallback } from "passport-42";
import { AuthService } from "../service/auth.service";
declare const FortyTwoStrategy_base: new (...args: any[]) => any;
export declare class FortyTwoStrategy extends FortyTwoStrategy_base {
    private configService;
    private authService;
    constructor(configService: ConfigService, authService: AuthService);
    validate(request: {
        session: {
            accessToken: string;
        };
    }, accessToken: string, refreshToken: string, profile: Profile, cb: VerifyCallback): Promise<any>;
}
export {};
