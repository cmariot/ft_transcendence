import { UserDto } from "src/users/dto/user.dto";
import { UsersService } from "src/users/services/users/users.service";
export declare class AuthService {
    private usersService;
    constructor(usersService: UsersService);
    login_success(): string;
    login_failure(): string;
    logout(): string;
    forty_two(): string;
    forty_two_redirection(): string;
    validateUser(user: UserDto, access_token: string): Promise<UserDto & import("../../database").User>;
}
