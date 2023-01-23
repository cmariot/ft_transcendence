import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatedFrom, UserEntity } from '../entity/user.entity';
import { RegisterDto } from 'src/auth/dtos/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
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

  async encode_password(rawPassword: string): Promise<string> {
    const saltRounds: number = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(rawPassword, salt);
  }

  async register(registerDto: RegisterDto): Promise<UserEntity> {
    let db_user = await this.getByUsername(registerDto.username);
    if (db_user && db_user.username === registerDto.username) {
      return null;
    }
    let hashed_password = await this.encode_password(registerDto.password);
    let user = {
      createdFrom: CreatedFrom.REGISTER,
      username: registerDto.username,
      email: registerDto.email,
      password: hashed_password,
    };
    return this.saveUser(user);
  }
}
