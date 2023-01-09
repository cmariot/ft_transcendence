import { Repository } from "typeorm";
import { Users } from "./users.entity";
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<Users>);
    add_user(user: Users): Promise<Users>;
    get_users(): Promise<Users[]>;
    findById(id: string): Promise<Users | undefined>;
    findByUsername(username: string): Promise<Users | undefined>;
}
