import { Repository } from "typeorm";
import { UserEntity } from "../entity/user.entity";
export declare class UsersService {
    private userRepository;
    constructor(userRepository: Repository<UserEntity>);
    saveUser(user: UserEntity): Promise<UserEntity>;
    getUsers(): Promise<UserEntity[]>;
    findById(uuid: number): Promise<UserEntity>;
}
