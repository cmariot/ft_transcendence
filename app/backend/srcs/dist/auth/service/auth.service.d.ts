import { UserEntity } from "../../users/entity/user.entity";
import { UsersService } from "src/users/services/users.service";
export declare class AuthService {
    private usersService;
    constructor(usersService: UsersService);
    validateUser(user: UserEntity): Promise<UserEntity>;
    login_success(): string;
}
