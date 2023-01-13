import { Repository } from "typeorm";
import { User } from "src/users/entity/user.entity";
export declare class UsersService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    saveUser(user: User): Promise<User>;
    getUsers(): Promise<User[]>;
    getUserById(id: number): Promise<User>;
    remove(id: string): Promise<void>;
    findByUsername(username: string): Promise<User | null>;
}
