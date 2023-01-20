import { Injectable, Redirect, UnauthorizedException } from "@nestjs/common";
import { CreatedFrom, UserEntity } from "../../users/entity/user.entity";
import { UsersService } from "src/users/services/users.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class Auth42Service {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    // 3 cas :
    // - Username invalide (deja pris par quelqu'un qui s'est register avec Username + Password)
    // - Deja enregistre dans la BDD : Connexion
    // - Jamais enregistre dans la BDD : Enregistrement
    async signin_or_register_42_user(user_42: {
        username: string;
        email: string;
        createdFrom: string;
        password: string;
    }): Promise<UserEntity> {
        let bdd_user = await this.usersService.getByUsername(user_42.username);
        if (bdd_user && bdd_user.createdFrom === CreatedFrom.OAUTH42) {
            return bdd_user;
        } else if (bdd_user && bdd_user.createdFrom != CreatedFrom.OAUTH42) {
            return null;
        } else {
            return this.usersService.saveUser(user_42);
        }
    }

    // Creacte a JWT token
    generate_jwt_token(user: UserEntity): string {
        const payload = { username: user.username, sub: user.uuid };
        let token = this.jwtService.sign(payload);
        return token;
    }

    create_authentification_cookie(user, res) {
        let authentification_value: string = this.generate_jwt_token(user);
        res.cookie("authentification", authentification_value, {
            maxAge: 1000 * 60 * 60 * 2, // 2 hours
            httpOnly: true,
            sameSite: "none",
            secure: true,
        }).send(user.username);
    }
}
