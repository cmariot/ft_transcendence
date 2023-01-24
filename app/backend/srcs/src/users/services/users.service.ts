import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreatedFrom, UserEntity } from "../entity/user.entity";
import { RegisterDto } from "src/auth/dtos/register.dto";
import * as bcrypt from "bcrypt";

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

    async getByID(id: string): Promise<UserEntity> {
        return this.userRepository.findOneBy({ uuid: id });
    }
    async getByUsername(username: string): Promise<UserEntity> {
        return this.userRepository.findOneBy({ username: username });
    }

    async getById42(id42: number): Promise<UserEntity> {
        return this.userRepository.findOneBy({ id42: id42 });
    }

    async encode_password(rawPassword: string): Promise<string> {
        const saltRounds: number = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        return bcrypt.hashSync(rawPassword, salt);
    }

    async register(registerDto: RegisterDto): Promise<UserEntity> {
        let db_user = await this.getByUsername(registerDto.username);
        if (db_user && db_user.username === registerDto.username) {
            console.log("Unavailable username");
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

    async getProfile(id: string) {
        let user = await this.getByID(id);
        if (user === undefined) {
            return;
        }
        return user;
    }

    async updateUsername(previousUsername: string, newUsername: string) {
        let alreadyTaken = await this.getByUsername(newUsername);
        if (alreadyTaken) {
            console.log("New username unavailable");
            throw new UnauthorizedException();
        }
        console.log("New username available");
        let value = await this.userRepository.update(
            { username: previousUsername },
            { username: newUsername }
        );
        console.log(value);
        return value;
    }

    async updateProfileImage(uuid: string, imageName: string) {
        let value = await this.userRepository.update(
            { uuid: uuid },
            { profileImage: imageName }
        );
        console.log(value);
        return value;
    }
}
