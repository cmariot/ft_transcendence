import { User } from "../../users/entity/user.entity";
import { UsersService } from "src/users/services/users/users.service";
export declare class AuthService {
    private usersService;
    constructor(usersService: UsersService);
    forty_two(): void;
    forty_two_redirection(): void;
    login_success(): string;
    login_failure(): string;
    logout(): string;
    validateUser(user: User, access_token: string): Promise<User>;
}
