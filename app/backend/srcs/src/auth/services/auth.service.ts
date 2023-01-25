import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreatedFrom, UserEntity } from "../../users/entity/user.entity";
import { UsersService } from "src/users/services/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    // Creacte a JWT token
    generate_jwt_token(user: UserEntity): string {
        const payload = { email: user.email, sub: user.uuid };
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
        }).redirect("https://localhost:8443/");
    }

    // 3 cas :
    // - Username invalide (deja pris par quelqu'un qui s'est register avec Username + Password)
    // - Deja enregistre dans la BDD : Connexion
    // - Jamais enregistre dans la BDD : Enregistrement
    async signin_or_register_42_user(
        user_42: {
            id42: number;
            username: string;
            email: string;
            createdFrom: string;
            password: string;
        },
        res
    ): Promise<UserEntity> {
        let bdd_user = await this.usersService.getById42(user_42.id42);
        if (bdd_user && bdd_user.createdFrom != CreatedFrom.OAUTH42) {
            console.log("The username is already registered but from FORM");
            throw new HttpException('The username is already registered but from FORM.', HttpStatus.FORBIDDEN);
        } else if (bdd_user && bdd_user.createdFrom === CreatedFrom.OAUTH42) {
            console.log("Sign in 42 user");
            this.create_authentification_cookie(
                bdd_user,
                res
            );
            return bdd_user;
        } else {
            console.log("Saving the user in the database.");
            let new_user: UserEntity = await this.usersService.saveUser(
                user_42
            );
            this.create_authentification_cookie(
                new_user,
                res
            );
            return new_user;
        }
    }

    async signin_local_user(
        username: string,
        password: string,
        res
    ) {
        const user = await this.usersService.getByUsername(username);
        if (
            user &&
            user.createdFrom === CreatedFrom.REGISTER &&
            (await bcrypt.compare(password, user.password)) === true
        ) {
            console.log("Logged as ", user.username);
            return (this.create_authentification_cookie(
                user,
                res
            ));
        }
        throw new HttpException('Login failed.', HttpStatus.FORBIDDEN);
    }
}
