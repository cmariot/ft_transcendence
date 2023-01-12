import { AuthService } from '../service/auth.service';
import { ConfigService } from '@nestjs/config';
import { Profile } from 'passport';
import { VerifyCallback } from 'passport-jwt';
import { UsersService } from 'src/users/services/users/users.service';
declare const FortyTwoStrategy_base: new (...args: any[]) => any;
export declare class FortyTwoStrategy extends FortyTwoStrategy_base {
    private readonly authService;
    private readonly usersService;
    private readonly configService;
    constructor(authService: AuthService, usersService: UsersService, configService: ConfigService);
    validate(request: {
        session: {
            accessToken: string;
        };
    }, accessToken: string, refreshToken: string, profile: Profile, cb: VerifyCallback): Promise<any>;
}
export {};
