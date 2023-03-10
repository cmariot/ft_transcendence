import {
    HttpException,
    HttpStatus,
    Injectable,
    Req,
    Res,
    UnauthorizedException,
} from "@nestjs/common";
import { CreatedFrom, UserEntity } from "../../users/entity/user.entity";
import { UsersService } from "src/users/services/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { SocketService } from "src/chat/services/socket.service";
import { LoginDto } from "../dtos/login.dto";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private socketService: SocketService
    ) {}

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
        @Req() req,
        @Res() res
    ) {
        const registered = await this.usersService.getByUsername(
            user_42.username
        );
        if (registered && registered.createdFrom !== CreatedFrom.OAUTH42) {
            res.redirect(process.env.HOST + "/unavailable-username");
            throw new HttpException(
                "This username is already registered.",
                226
            );
        }
        let user: UserEntity = await this.usersService.getById42(user_42.id42);
        if (user && user.createdFrom === CreatedFrom.OAUTH42) {
            if (user.twoFactorsAuth) {
                await this.create_cookie(
                    user,
                    "double_authentification",
                    req,
                    res
                );
                await this.usersService.generateDoubleAuthCode(user.uuid);
            } else {
                return await this.create_cookie(
                    user,
                    "authentification",
                    req,
                    res
                );
            }
        } else {
            user = await this.usersService.saveUser(user_42);
            return await this.create_cookie(user, "authentification", req, res);
        }
    }

    async signin_local_user(loginDto: LoginDto, @Req() req, @Res() res) {
        let user: UserEntity = await this.usersService.getByUsername(
            loginDto.username
        );
        if (
            user &&
            user.createdFrom === CreatedFrom.REGISTER &&
            (await bcrypt.compare(loginDto.password, user.password)) === true
        ) {
            if (user.valideEmail === false) {
                await this.usersService.resendEmail(user.uuid);
                return await this.create_cookie(
                    user,
                    "email_validation",
                    req,
                    res
                );
            } else if (user.twoFactorsAuth === true) {
                await this.create_cookie(
                    user,
                    "double_authentification",
                    req,
                    res
                );
                return await this.usersService.generateDoubleAuthCode(
                    user.uuid
                );
            } else {
                return await this.create_cookie(
                    user,
                    "authentification",
                    req,
                    res
                );
            }
        }
        throw new HttpException("Login failed.", HttpStatus.FORBIDDEN);
    }

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
    async create_cookie(
        user: UserEntity,
        type: string,
        @Req() req,
        @Res() res
    ) {
        let i = 0;
        while (i < user.socketId.length) {
            await this.socketService.disconnect_user(user.socketId[i]);
            i++;
        }
        await this.usersService.clearSocket(user.uuid);
        const twelveHours = 1000 * 60 * 60 * 12;
        const cookie_value: string = this.sign_cookie(user, type);
        if (user.createdFrom === CreatedFrom.OAUTH42) {
            if (type === "double_authentification") {
                res.clearCookie("authentification", {
                    maxAge: twelveHours,
                    sameSite: "none",
                    secure: true,
                })
                    .clearCookie("email_validation", {
                        maxAge: twelveHours,
                        sameSite: "none",
                        secure: true,
                    })
                    .clearCookie("double_authentification", {
                        maxAge: twelveHours,
                        sameSite: "none",
                        secure: true,
                    })
                    .cookie(type, cookie_value, {
                        maxAge: twelveHours,
                        sameSite: "none",
                        secure: true,
                    })
                    .redirect(process.env.HOST + "/double-authentification");
            } else if (type === "authentification") {
                res.clearCookie("authentification", {
                    maxAge: twelveHours,
                    sameSite: "none",
                    secure: true,
                })
                    .clearCookie("email_validation", {
                        maxAge: twelveHours,
                        sameSite: "none",
                        secure: true,
                    })
                    .clearCookie("double_authentification", {
                        maxAge: twelveHours,
                        sameSite: "none",
                        secure: true,
                    })
                    .cookie(type, cookie_value, {
                        maxAge: twelveHours,
                        sameSite: "none",
                        secure: true,
                    })
                    .redirect(process.env.HOST);
            } else {
                throw new UnauthorizedException(
                    "42 users doesn't need to validate their email :)"
                );
            }
        } else {
            res.clearCookie("authentification", {
                maxAge: twelveHours,
                sameSite: "none",
                secure: true,
            })
                .clearCookie("email_validation", {
                    maxAge: twelveHours,
                    sameSite: "none",
                    secure: true,
                })
                .clearCookie("double_authentification", {
                    maxAge: twelveHours,
                    sameSite: "none",
                    secure: true,
                })
                .cookie(type, cookie_value, {
                    maxAge: twelveHours,
                    sameSite: "none",
                    secure: true,
                })
                .send(type);
        }
    }

    logout(@Res() res) {
        const twelveHours = 1000 * 60 * 60 * 12;
        return res
            .clearCookie("authentification", {
                maxAge: twelveHours,
                sameSite: "none",
                secure: true,
            })
            .send("Bye !");
    }
}
