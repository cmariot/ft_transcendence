import { UsersService } from "src/users/services/users/users.service";
export declare class UsersController {
    private readonly userService;
    constructor(userService: UsersService);
    getUsers(): Promise<import("../../entity/user.entity").User[]>;
}
