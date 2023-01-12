import { UserDto } from "src/users/dto/user.dto";
import { UsersService } from "src/users/services/users/users.service";
export declare class UsersController {
    private readonly userService;
    constructor(userService: UsersService);
    getUsers(): import("rxjs").Observable<import("../../../database").User[]>;
    createUsers(UserDto: UserDto): Promise<UserDto & import("../../../database").User>;
}
