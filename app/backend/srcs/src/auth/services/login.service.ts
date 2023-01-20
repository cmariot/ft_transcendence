import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "src/users/services/users.service";
import { LoginDto } from "../dtos/login.dto";
import { CreatedFrom, UserEntity } from "src/users/entity/user.entity";
import * as bcrypt from "bcrypt";

@Injectable()
export class LoginService {
    constructor(private usersService: UsersService) {}

    async signin_local_user(
        username: string,
        password: string
    ): Promise<UserEntity> {
        const user = await this.usersService.getByUsername(username);
        if (
            user &&
            user.createdFrom === CreatedFrom.REGISTER &&
            (await bcrypt.compare(password, user.password)) === true
        ) {
            return user;
        }
        return null;
    }
}