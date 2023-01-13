import { UsersService } from "../services/users.service";
export declare class UsersController {
    private readonly userService;
    constructor(userService: UsersService);
    getUsers(): Promise<import("../entity/user.entity").UserEntity[]>;
}
