import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
export declare class LoginService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(username: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
    }>;
}
