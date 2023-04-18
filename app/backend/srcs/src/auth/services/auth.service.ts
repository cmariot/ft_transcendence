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
import { LoginDto } from "../dtos/login.dto";
import { RegisterDto } from "../dtos/register.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        private usersService: UsersService,
        private jwtService: JwtService,
        private readonly mailerService: MailerService
    ) {}

    // Add an UserEntity into the database
    async saveUser(user: any): Promise<UserEntity> {
        if (user.createdFrom === CreatedFrom.REGISTER) {
            this.sendVerificationMail(user);
        }
        return await this.userRepository.save(user);
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
        @Req() req,
        @Res() res
    ) {
        const registered = await this.usersService.getByUsername(
            user_42.username
        );
        if (registered && registered.createdFrom !== CreatedFrom.OAUTH42) {
            res.redirect(process.env.HOST + "unavailable-username");
            throw new HttpException(
                "This username is already registered.",
                226
            );
        }
        let user: UserEntity | null = await this.usersService.getById42(
            user_42.id42
        );
        if (user && user.createdFrom === CreatedFrom.OAUTH42) {
            if (user.twoFactorsAuth) {
                await this.create_cookie(
                    user,
                    "double_authentification",
                    req,
                    res
                );
                await this.generateDoubleAuthCode(user.uuid);
            } else {
                return await this.create_cookie(
                    user,
                    "authentification",
                    req,
                    res
                );
            }
        } else {
            user = await this.saveUser(user_42);
            return await this.create_cookie(user, "authentification", req, res);
        }
    }

    async signin_local_user(loginDto: LoginDto, @Req() req, @Res() res) {
        let user: UserEntity | null = await this.usersService.getByUsername(
            loginDto.username
        );
        if (
            user &&
            user.createdFrom === CreatedFrom.REGISTER &&
            (await bcrypt.compare(loginDto.password, user.password)) === true
        ) {
            if (user.valideEmail === false) {
                await this.resendEmail(user.uuid);
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
                return await this.generateDoubleAuthCode(user.uuid);
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

    async generateDoubleAuthCode(uuid: string) {
        let user = await this.usersService.getByID(uuid);
        const randomNumber = this.getRandomCode();
        if (!user) {
            throw new UnauthorizedException("User not found.");
        }
        await this.userRepository.update(
            { uuid: uuid },
            {
                doubleAuthentificationCode: randomNumber,
                date2fa: new Date(),
            }
        );
        this.mailerService
            .sendMail({
                to: user.email, // list of receivers
                from: "ft_transcendence <" + process.env.EMAIL_ADDR + ">", // sender address
                subject: "Your double-authentification code", // Subject line
                text:
                    "Welcome back" +
                    user.username +
                    ", here is your double authentification code :" +
                    randomNumber, // plaintext body
                html:
                    "<div style='display:flex; flex-direction: column; justify-content:center; align-items: center;' >\
                        <h1>Welcome back " +
                    user.username +
                    " !</h1>\
                        <h3>Here is your double authentification code :</h3>\
                        <h2>" +
                    randomNumber +
                    "</h2>\
                    </div>\
                    ",
            })
            .then(() => {
                return "Email send.";
            })
            .catch((err) => {
                console.log(err);
            });
    }

    getRandomCode(): string {
        const min = Math.ceil(100000);
        const max = Math.floor(999999);
        const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
        return randomNumber.toString();
    }

    // to: list of receivers
    // from: sender address
    // subject: object line
    // text: plaintext body
    // html: html body
    async sendVerificationMail(user: UserEntity) {
        await this.mailerService.sendMail({
            to: user.email,
            from: "ft_transcendence <" + process.env.EMAIL_ADDR + ">",
            subject: "Validate your email",
            text:
                "Welcome to ft_transcendence, validate your account with this code :" +
                user.emailValidationCode,
            html:
                "<div style='display:flex; flex-direction: column; justify-content:center; align-items: center;' >\
                        <h1>Welcome to ft_transcendence</h1>\
                        <h3>Validate your email with this code :</h3>\
                        <h2>" +
                user.emailValidationCode +
                "</h2>\
                    </div>\
                    ",
        });
    }

    async encode_password(rawPassword: string): Promise<string> {
        const saltRounds: number = 11;
        const salt = bcrypt.genSaltSync(saltRounds);
        return bcrypt.hashSync(rawPassword, salt);
    }

    async register(registerDto: RegisterDto): Promise<UserEntity> {
        let hashed_password = await this.encode_password(registerDto.password);
        const randomNumber = this.getRandomCode();
        let partial_user = {
            createdFrom: CreatedFrom.REGISTER,
            username: registerDto.username,
            email: registerDto.email,
            password: hashed_password,
            twoFactorsAuth: registerDto.enable2fa,
            emailValidationCode: randomNumber,
            dateEmailCode: new Date(),
        };
        let user: UserEntity | null = await this.usersService.getByUsername(
            registerDto.username
        );
        if (user) {
            if (user.valideEmail) {
                throw new HttpException(
                    "This username is already registered.",
                    HttpStatus.UNAUTHORIZED
                );
            } else {
                await this.userRepository.update(
                    { uuid: user.uuid },
                    {
                        email: partial_user.email,
                        createdFrom: CreatedFrom.REGISTER,
                        password: partial_user.password,
                        twoFactorsAuth: partial_user.twoFactorsAuth,
                        date2fa: new Date(),
                        emailValidationCode: partial_user.emailValidationCode,
                    }
                );
                user = await this.usersService.getByUsername(
                    registerDto.username
                );
            }
        } else {
            user = await this.userRepository.save(partial_user);
        }
        if (!user) {
            throw new HttpException(
                "Cannot register, please try again later.",
                HttpStatus.NO_CONTENT
            );
        }
        if (user.createdFrom === CreatedFrom.REGISTER) {
            this.sendVerificationMail(user);
        }
        return user;
    }

    async validate_email(uuid: string, code: string): Promise<UserEntity> {
        const user = await this.usersService.getByID(uuid);
        if (!user) {
            throw new UnauthorizedException("User not found.");
        }
        if (code !== user.emailValidationCode) {
            throw new HttpException("Invalid code.", HttpStatus.NOT_ACCEPTABLE);
        }
        const now = new Date();
        const diff = now.valueOf() - user.dateEmailCode.valueOf();
        const fifteenMinutes: number = 1000 * 60 * 15;
        if (diff > fifteenMinutes) {
            await this.resendEmail(uuid);
            throw new HttpException(
                "Your code is expired, we send you a new code.",
                HttpStatus.NOT_ACCEPTABLE
            );
        }
        await this.userRepository.update(
            { uuid: uuid },
            { valideEmail: true, emailValidationCode: "" }
        );
        return user;
    }

    async resendEmail(uuid: string) {
        let user: UserEntity | null = await this.usersService.getByID(uuid);
        if (!user) {
            throw new UnauthorizedException("User not found.");
        }
        const now: Date = new Date();
        const oneMinute: number = 1000 * 60;
        const diff: number = now.valueOf() - user.dateEmailCode.valueOf();
        if (diff < oneMinute) {
            throw new UnauthorizedException("Don't spam.");
        }
        user.emailValidationCode = this.getRandomCode();
        user.dateEmailCode = new Date();
        await this.userRepository.save(user);
        return await this.sendVerificationMail(user);
    }

    // use JWT to sign the cookie value
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
    // double_authentification : Doit valider sa double connexion
    async create_cookie(
        user: UserEntity,
        type: string,
        @Req() req,
        @Res() res
    ) {
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
                    .redirect(process.env.HOST + "double-authentification");
            } else if (type === "authentification") {
                if (user.twoFactorsAuth === true && user.firstLog === false) {
                    return res
                        .clearCookie("authentification", {
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
                        .send(process.env.HOST);
                } else {
                    return res
                        .clearCookie("authentification", {
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
                }
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

    // clear cookie on logout
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
