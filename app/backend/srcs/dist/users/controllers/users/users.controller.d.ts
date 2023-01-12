import { CreateUserDto } from "src/users/dto/CreateUser.dto";
import { UsersService } from "src/users/services/users/users.service";
export declare class UsersController {
    private readonly userService;
    constructor(userService: UsersService);
    getUsers(): import("rxjs").Observable<import("../../../database").User[]>;
    createUsers(createUserDto: CreateUserDto): Promise<import("../../../database").User>;
}
