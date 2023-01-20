import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "src/users/services/users.service";
import { RegisterDto } from "../dtos/register.dto";
import { CreatedFrom, UserEntity } from "src/users/entity/user.entity";
import * as bcrypt from "bcrypt";

@Injectable()
export class RegisterService {
    constructor(private usersService: UsersService) {}

    async encode_password(rawPassword: string): Promise<string> {
        const saltRounds: number = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        return bcrypt.hashSync(rawPassword, salt);
    }

    async register(registerDto: RegisterDto): Promise<UserEntity> {
        let db_user = await this.usersService.getByUsername(
            registerDto.username
        );
        if (db_user && db_user.username === registerDto.username) {
            return null; // Username already registered
        }
        let hashed_password = await this.encode_password(registerDto.password);
        let user = {
            createdFrom: CreatedFrom.REGISTER,
            username: registerDto.username,
            email: registerDto.email,
            password: hashed_password,
        };
        return this.usersService.saveUser(user);
    }
}
