import { User } from "src/database";
import { Repository } from "typeorm";
import { UserDto } from "src/users/dto/user.dto";
import { Observable } from "rxjs";
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    createUser(UserDto: UserDto): Promise<UserDto & User>;
    getUsers(): Observable<User[]>;
    findByUsername(username: string): Promise<User | undefined>;
}
