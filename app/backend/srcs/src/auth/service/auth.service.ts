import { Injectable } from "@nestjs/common";
import { UserEntity } from "../../users/entity/user.entity";
import { UsersService } from "src/users/services/users.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    // Returns the user who try to connect if it's already signin,
    // Or add it's informations to the database
    async validateUser(user: {
        username: string;
        email: string;
        createdFrom: string;
    }): Promise<UserEntity> {
        let db_user: UserEntity = await this.usersService.getByUsername(
            user.username
        );
        if (
            db_user &&
            user.createdFrom === "42" &&
            user.email === db_user.email
        ) {
            return db_user;
        }
        return this.usersService.saveUser(user);
    }

    // Returns a JWT token
    login(user: UserEntity): string {
        const payload = { username: user.username, sub: user.uuid };
        let token = this.jwtService.sign(payload);
        return token;
    }

    create_authentification_cookie(req, res) {
        let authentification_value: string = this.login(req.user);
        res.cookie("authentification", authentification_value, {
            maxAge: 1000 * 60 * 60 * 2, // 2 hours
            httpOnly: true,
            sameSite: "none",
            secure: true,
        }).redirect("https://localhost:8443/");
    }
}
