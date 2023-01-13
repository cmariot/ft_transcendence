import { Repository } from "typeorm";
import { UserEntity } from "../entity/user.entity";
export declare class UsersService {
    private userRepository;
    constructor(userRepository: Repository<UserEntity>);
    saveUser(user: any): Promise<UserEntity>;
    getUsers(): Promise<UserEntity[]>;
    getByUsername(username: string): Promise<UserEntity | undefined>;
}
