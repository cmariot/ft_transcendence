import { UserEntity } from "../../users/entity/user.entity";
import { UsersService } from "src/users/services/users.service";
import { JwtService } from "@nestjs/jwt";
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(user: {
        username: string;
        displayName: string;
        email: string;
    }): Promise<UserEntity>;
    login(user: UserEntity): Promise<{
        access_token: string;
    }>;
}
