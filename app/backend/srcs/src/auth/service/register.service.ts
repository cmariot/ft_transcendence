import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "src/users/services/users.service";
import { RegisterDto } from "../dto/register.dto";
import { CreatedFrom, UserEntity } from "src/users/entity/user.entity";

@Injectable()
export class RegisterService {
    constructor(private usersService: UsersService) {}

    async validate(registerDto: RegisterDto): Promise<UserEntity> {
        let user = {
            createdFrom: CreatedFrom.REGISTER,
            username: registerDto.username,
            email: registerDto.email,
            password: registerDto.password,
        };
        console.log(user);
        let db_user = await this.usersService.getByUsername(user.username);
        if (db_user) {
            throw new UnauthorizedException();
        }
        return this.usersService.saveUser(user);
    }
}
