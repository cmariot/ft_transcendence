import { AuthService } from "../service/auth.service";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    forty_two(): void;
    forty_two_redirect(req: any, res: any): Promise<void>;
    test(): string;
    logout(res: any): void;
}
