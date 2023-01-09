import { ConfigService } from "@nestjs/config";
import { Profile, VerifyCallback } from "passport-42";
declare const LocalStrategy_base: new (...args: any[]) => any;
export declare class LocalStrategy extends LocalStrategy_base {
    private readonly configService;
    constructor(configService: ConfigService);
    validate(request: {
        session: {
            accessToken: string;
        };
    }, accessToken: string, refreshToken: string, profile: Profile, cb: VerifyCallback): Promise<any>;
}
export {};
