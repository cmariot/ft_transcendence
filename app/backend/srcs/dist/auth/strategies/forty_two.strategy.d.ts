import { Profile } from "passport";
import { AuthService } from "../service/auth.service";
import { UserEntity } from "src/users/entity/user.entity";
declare const FortyTwoStrategy_base: new (...args: any[]) => any;
export declare class FortyTwoStrategy extends FortyTwoStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(accessToken: string, refreshToken: string, profile: Profile): Promise<UserEntity>;
}
export {};
