import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "src/users/services/users.service";
import { LoginDto } from "../dtos/login.dto";
import { CreatedFrom } from "src/users/entity/user.entity";

@Injectable()
export class LoginService {
    constructor(private usersService: UsersService) {}

    async login(loginDto: LoginDto) {
        console.log(loginDto);
        const user = await this.usersService.getByUsername(loginDto.username);
        if (
            user &&
            user.createdFrom === CreatedFrom.REGISTER &&
            user.password === loginDto.password
        ) {
            const { password, ...result } = user;
            return result;
        }
        throw new UnauthorizedException();
    }
}
