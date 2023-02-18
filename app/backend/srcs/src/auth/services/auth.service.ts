import {
    HttpException,
    HttpStatus,
    Injectable,
    Res,
    UnauthorizedException,
} from "@nestjs/common";
import {
    CreatedFrom,
    Status,
    UserEntity,
} from "../../users/entity/user.entity";
import { UsersService } from "src/users/services/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private readonly mailerService: MailerService
    ) {}

    sign_cookie(user: UserEntity, type: string): string {
        const payload = {
            uuid: user.uuid,
            email: user.email,
            type: type,
        };
        let token = this.jwtService.sign(payload);
        return token;
    }

    // authentification : Acces a l'app
    // email_validation : Doit valider son email
    // double_authentification : Doit valider sa connexion
    create_cookie(user: UserEntity, type: string, @Res() res) {
        const cookie_value: string = this.sign_cookie(user, type);
        if (user.createdFrom === CreatedFrom.OAUTH42) {
            if (type === "double_authentification") {
                res.clearCookie("authentification")
                    .clearCookie("email_validation")
                    .clearCookie("double_authentification")
                    .cookie(type, cookie_value, {
                        maxAge: 1000 * 60 * 60 * 2, // 2 hours
                        sameSite: "none",
                        secure: true,
                    })
                    .redirect("https://localhost:8443/double-authentification");
            } else if (type === "authentification") {
                this.usersService.user_status(user.username, Status.ONLINE);
                res.clearCookie("authentification")
                    .clearCookie("email_validation")
                    .clearCookie("double_authentification")
                    .cookie(type, cookie_value, {
                        maxAge: 1000 * 60 * 60 * 2, // 2 hours
                        sameSite: "none",
                        secure: true,
                    })
                    .redirect("https://localhost:8443/");
            } else {
                throw new UnauthorizedException();
            }
        } else {
            res.clearCookie("authentification")
                .clearCookie("email_validation")
                .clearCookie("double_authentification")
                .cookie(type, cookie_value, {
                    maxAge: 1000 * 60 * 60 * 2, // 2 hours
                    sameSite: "none",
                    secure: true,
                })
                .send(type);
        }
    }

    async signin_or_register_42_user(
        user_42: {
            id42: number;
            username: string;
            email: string;
            createdFrom: string;
            password: string;
            twoFactorsAuth: boolean;
            valideEmail: boolean;
        },
        res
    ): Promise<UserEntity> {
        let bdd_user = await this.usersService.getById42(user_42.id42);
        if (bdd_user && bdd_user.createdFrom != CreatedFrom.OAUTH42) {
            throw new HttpException(
                "The username is already registered but from FORM.",
                HttpStatus.FORBIDDEN
            );
        } else if (bdd_user && bdd_user.createdFrom === CreatedFrom.OAUTH42) {
            if (bdd_user.twoFactorsAuth) {
                this.create_cookie(bdd_user, "double_authentification", res);
                await this.usersService.generateDoubleAuthCode(bdd_user.uuid);
            } else {
                this.create_cookie(bdd_user, "authentification", res);
            }
            return bdd_user;
        } else {
            let new_user: UserEntity = await this.usersService.saveUser(
                user_42
            );
            this.create_cookie(new_user, "authentification", res);
            return new_user;
        }
    }

    async signin_local_user(username: string, password: string, res) {
        let user: UserEntity = await this.usersService.getByUsername(username);
        if (
            user &&
            user.createdFrom === CreatedFrom.REGISTER &&
            (await bcrypt.compare(password, user.password)) === true
        ) {
            if (user.valideEmail === false) {
                await this.usersService.resendEmail(user.uuid);
                this.create_cookie(user, "email_validation", res);
            } else if (user.twoFactorsAuth === true) {
                this.create_cookie(user, "double_authentification", res);
                await this.usersService.generateDoubleAuthCode(user.uuid);
            } else {
                this.create_cookie(user, "authentification", res);
            }
            return;
        }
        throw new HttpException("Login failed.", HttpStatus.FORBIDDEN);
    }

    logout(@Res() res) {
        res.clearCookie("authentification", {
            sameSite: "none",
            secure: true,
        }).send("Bye !");
    }
}
