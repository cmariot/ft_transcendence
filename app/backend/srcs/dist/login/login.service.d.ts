import { UsersService } from "src/users/users.service";
export declare class LoginService {
    private usersService;
    constructor(usersService: UsersService);
    validateUser(token: string): Promise<any>;
}
