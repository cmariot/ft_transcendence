import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "../entity/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  // Add an UserEntity into the database
  async saveUser(user): Promise<UserEntity> {
    return this.userRepository.save(user);
  }

  // Get all the users in the database
  getUsers(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  getByUsername(username: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOneBy({ username: username });
  }
}
