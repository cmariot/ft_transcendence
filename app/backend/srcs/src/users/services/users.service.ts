import {
    HttpException,
    HttpStatus,
    Injectable,
    StreamableFile,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreatedFrom, UserEntity } from "../entity/user.entity";
import { RegisterDto } from "src/auth/dtos/register.dto";
import * as bcrypt from "bcrypt";
import { createReadStream } from "fs";
import { join } from "path";

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
        const saltRounds: number = 11;
        const salt = bcrypt.genSaltSync(saltRounds);
        return bcrypt.hashSync(rawPassword, salt);
    }

    async register(registerDto: RegisterDto): Promise<UserEntity> {
        let db_user: UserEntity = await this.getByUsername(
            registerDto.username
        );
        if (db_user && db_user.username === registerDto.username) {
            throw new HttpException(
                "This username is already registered.",
                HttpStatus.UNAUTHORIZED
            );
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
            throw new HttpException("Invalid uuid.", HttpStatus.FORBIDDEN);
        }
        return user;
    }

    async updateUsername(previousUsername: string, newUsername: string) {
        let alreadyTaken = await this.getByUsername(newUsername);
        if (alreadyTaken) {
            throw new HttpException(
                "This username is already registered.",
                HttpStatus.UNAUTHORIZED
            );
        }
        await this.userRepository.update(
            { username: previousUsername },
            { username: newUsername }
        );
        return "Username updated.";
    }

    async updateProfileImage(uuid: string, imageName: string) {
        this.getProfile(uuid);
        await this.userRepository.update(
            { uuid: uuid },
            { profileImage: imageName }
        );
        return "Image updated.";
    }

    async getProfileImage(uuid: string) {
        let user = await this.getByID(uuid);
        console.log(user.profileImage);
        if (user.profileImage === null) {
            const file = createReadStream(
                join(process.cwd(), "./default/profile_image.png")
            );
            return new StreamableFile(file);
        } else {
            const file = createReadStream(
                join(
                    process.cwd(),
                    "./uploads/profile_pictures/" + user.profileImage
                )
            );
            return new StreamableFile(file);
        }
    }
}
