import { Injectable } from "@nestjs/common";
import { UsersService } from "src/users/services/users.service";
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
            console.log("Logged as ", user.username);
            return user;
        }
        console.log("Login failed")
        return null;
    }
}
