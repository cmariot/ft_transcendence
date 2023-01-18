import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "src/users/services/users.service";
import { LoginDto } from "../dtos/login.dto";
import { CreatedFrom } from "src/users/entity/user.entity";
import * as bcrypt from "bcrypt";

@Injectable()
export class LoginService {
    constructor(private usersService: UsersService) {}

    async login(loginDto: LoginDto) {
        const user = await this.usersService.getByUsername(loginDto.username);
        if (
            user &&
            user.createdFrom === CreatedFrom.REGISTER &&
            (await bcrypt.compare(loginDto.password, user.password)) === true
        ) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
}
