import { UsersService } from './users.service';
import { Users } from './users.entity';
export declare class UsersController {
    private userService;
    constructor(userService: UsersService);
    get_users(): Promise<Users[]>;
    add_user(user: Users): Promise<Users>;
}
