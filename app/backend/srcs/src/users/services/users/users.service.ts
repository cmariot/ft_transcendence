import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/database";
import { Repository } from "typeorm";
import { UserDto } from "src/users/dto/user.dto";
import { Observable, from } from "rxjs";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  createUser(UserDto: UserDto) {
    return this.userRepository.save(UserDto);
  }

  getUsers(): Observable<User[]> {
    return from(this.userRepository.find());
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username: username } });
  }
}
