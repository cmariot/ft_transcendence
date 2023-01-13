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
  async saveUser(user: UserEntity): Promise<UserEntity> {
    return this.userRepository.save(user);
  }

  // Get all the users in the database
  getUsers(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  // Return the user by it's uuid, or null if not found
  findById(uuid: number): Promise<UserEntity> {
    return this.userRepository.findOneBy({ uuid: uuid });
  }
}
