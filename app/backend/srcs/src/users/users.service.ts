import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Users } from "./users.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>
  ) {}

  add_user(user: Users): Promise<Users> {
    return this.usersRepository.save(user);
  }

  get_users(): Promise<Users[]> {
    return this.usersRepository.find();
  }

  async findById(id: string): Promise<Users | undefined> {
    const users = await this.get_users();
    return users.find((user) => user.uuid == id);
  }

  async findByUsername(username: string): Promise<Users | undefined> {
    const users = await this.get_users();
    return users.find((user) => user.username === username);
  }
}
