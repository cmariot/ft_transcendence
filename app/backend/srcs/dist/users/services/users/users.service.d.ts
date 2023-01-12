import { User } from "src/database";
import { Repository } from "typeorm";
import { CreateUserDto } from "src/users/dto/CreateUser.dto";
import { Observable } from "rxjs";
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    createUser(createUserDto: CreateUserDto): Promise<User>;
    getUsers(): Observable<User[]>;
    findOne(username: string): Promise<User | undefined>;
}
