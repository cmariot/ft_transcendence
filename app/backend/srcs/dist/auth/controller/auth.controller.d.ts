import { AuthService } from "../service/auth.service";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login_success(): string;
    login_failure(): string;
    logout(): string;
    forty_two(): string;
    forty_two_redirect(): string;
}
