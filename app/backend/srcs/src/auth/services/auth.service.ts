import { Injectable } from "@nestjs/common";
import { UserEntity } from "../../users/entity/user.entity";
import { UsersService } from "src/users/services/users.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class Auth42Service {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    // Returns the user who try to connect if it's already signin,
    // Or add it's informations to the database
    async register_42_user(tmp_user: {
        username: string;
        email: string;
        createdFrom: string;
        password: string;
    }): Promise<UserEntity> {
        let already_registered_user: UserEntity = await this.usersService.getByUsername(
            tmp_user.username
        );
        if (
            already_registered_user &&
            tmp_user.createdFrom === "42" &&
            tmp_user.email === already_registered_user.email
        ) {
            return already_registered_user;
        }
        return this.usersService.saveUser(tmp_user);
    }

    // Returns a JWT token
    generate_jwt_token(user: UserEntity): string {
        const payload = { username: user.username, sub: user.uuid };
        let token = this.jwtService.sign(payload);
        return token;
    }

    create_authentification_cookie(req, res) {
        let authentification_value: string = this.generate_jwt_token(req.user);
        res.cookie("authentification", authentification_value, {
            maxAge: 1000 * 60 * 60 * 2, // 2 hours
            httpOnly: true,
            sameSite: "none",
            secure: true,
        }).redirect("https://localhost:8443/");
    }
}
