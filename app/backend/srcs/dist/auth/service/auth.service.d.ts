import { UsersService } from "src/users/services/users/users.service";
export declare class AuthService {
    private usersService;
    constructor(usersService: UsersService);
    login_success(): string;
    login_failure(): string;
    logout(): string;
    forty_two(): string;
    forty_two_redirection(): string;
    validateUser(username: string): Promise<any>;
}
