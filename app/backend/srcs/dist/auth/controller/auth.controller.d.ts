import { AuthService } from "../service/auth.service";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    forty_two(): void;
    forty_two_redirect(): void;
    login_success(): string;
    login_failure(): string;
    logout(): string;
}
