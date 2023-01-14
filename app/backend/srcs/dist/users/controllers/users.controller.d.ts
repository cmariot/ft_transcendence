import { UsersService } from "../services/users.service";
import { UserEntity } from "../entity/user.entity";
export declare class UsersController {
    private readonly userService;
    constructor(userService: UsersService);
    getUsers(): Promise<UserEntity[]>;
}
