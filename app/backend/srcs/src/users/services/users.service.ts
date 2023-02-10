import {
    HttpException,
    HttpStatus,
    Injectable,
    StreamableFile,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreatedFrom, UserEntity } from "../entity/user.entity";
import { RegisterDto } from "src/auth/dtos/register.dto";
import * as bcrypt from "bcrypt";
import { createReadStream } from "fs";
import * as fs from "fs";
import { join } from "path";
import { MailerService } from "@nestjs-modules/mailer";
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        private readonly mailerService: MailerService
    ) {}

    async sendVerificationMail(user) {
        this.mailerService
            .sendMail({
                to: user.email, // list of receivers
                from: "ft_transcendence <" + process.env.EMAIL_ADDR + ">", // sender address
                subject: "Validate your email", // Subject line
                text:
                    "Welcome to ft_transcendence, validate your account with this code :" +
                    user.emailValidationCode, // plaintext body
                html:
                    "<div style='display:flex; flex-direction: column; justify-content:center; align-items: center;' >\
                        <h1>Welcome to ft_transcendence</h1>\
                        <h3>Validate your email with this code :</h3>\
                        <h2>" +
                    user.emailValidationCode +
                    "</h2>\
                    </div>\
                    ",
            })
            .then((success) => {
                return "Email send.";
            })
            .catch((err) => {
                console.log(err);
            });
    }

    // Add an UserEntity into the database
    async saveUser(user): Promise<UserEntity> {
        if (user.createdFrom === CreatedFrom.REGISTER) {
            this.sendVerificationMail(user);
        }
        return this.userRepository.save(user);
    }

    // Delete an UserEntity from the database
    async deleteUser(uuid: string) {
        return this.userRepository.delete({ uuid: uuid });
    }

    // Get all the users in the database
    getUsers(): Promise<UserEntity[]> {
        return this.userRepository.find();
    }

    async getByID(id: string): Promise<UserEntity> {
        return this.userRepository.findOneBy({ uuid: id });
    }
    async getByUsername(username: string): Promise<UserEntity> {
        return this.userRepository.findOneBy({ username: username });
    }

    async getById42(id42: number): Promise<UserEntity> {
        return this.userRepository.findOneBy({ id42: id42 });
    }

    async getUsernameById(id: string): Promise<string> {
        const user = this.getByID(id);
        return (await user).username;
    }

    async encode_password(rawPassword: string): Promise<string> {
        const saltRounds: number = 11;
        const salt = bcrypt.genSaltSync(saltRounds);
        return bcrypt.hashSync(rawPassword, salt);
    }

    async deleteEmailValidationCode(uuid: string) {
        await this.userRepository.update(
            { uuid: uuid },
            { doubleAuthentificationCode: "" }
        );
    }

    async delete2faCode(uuid: string) {
        await this.userRepository.update(
            { uuid: uuid },
            { doubleAuthentificationCode: "" }
        );
    }

    async generateDoubleAuthCode(uuid: string) {
        const min = Math.ceil(100000);
        const max = Math.floor(999999);
        const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
        await this.userRepository.update(
            { uuid: uuid },
            { doubleAuthentificationCode: randomNumber.toString() }
        );
        await this.userRepository.update(
            { uuid: uuid },
            { doubleAuthentificationCodeCreation: new Date() }
        );
        let user = await this.getByID(uuid);
        this.mailerService
            .sendMail({
                to: user.email, // list of receivers
                from: "ft_transcendence <" + process.env.EMAIL_ADDR + ">", // sender address
                subject: "Your double-authentification code", // Subject line
                text:
                    "Welcome back, here is your double authentification code :" +
                    randomNumber.toString(), // plaintext body
                html:
                    "<div style='display:flex; flex-direction: column; justify-content:center; align-items: center;' >\
                        <h1>Welcome back !</h1>\
                        <h3>Here is your double authentification code :</h3>\
                        <h2>" +
                    randomNumber.toString() +
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

    async register(registerDto: RegisterDto): Promise<UserEntity> {
        let db_user: UserEntity = await this.getByUsername(
            registerDto.username
        );
        if (db_user && db_user.username === registerDto.username) {
            throw new HttpException(
                "This username is already registered.",
                HttpStatus.UNAUTHORIZED
            );
        }
        const min = Math.ceil(100000);
        const max = Math.floor(999999);
        const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
        let hashed_password = await this.encode_password(registerDto.password);
        let user = {
            createdFrom: CreatedFrom.REGISTER,
            username: registerDto.username,
            email: registerDto.email,
            password: hashed_password,
            twoFactorsAuth: registerDto.enable2fa,
            emailValidationCode: randomNumber.toString(),
            emailValidationCodeCreation: new Date(),
        };
        return this.saveUser(user);
    }

    async resendEmail(uuid: string) {
        const min = Math.ceil(100000);
        const max = Math.floor(999999);
        const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
        await this.userRepository.update(
            { uuid: uuid },
            { emailValidationCode: randomNumber.toString() }
        );
        await this.userRepository.update(
            { uuid: uuid },
            { emailValidationCodeCreation: new Date() }
        );
        const user: UserEntity = await this.getByID(uuid);
        this.sendVerificationMail(user);
    }

    async getProfile(id: string) {
        let user = await this.getByID(id);
        if (user === undefined) {
            throw new HttpException("Invalid uuid.", HttpStatus.FORBIDDEN);
        }
        return user;
    }

    async updateUsername(previousUsername: string, newUsername: string) {
        let alreadyTaken = await this.getByUsername(newUsername);
        if (alreadyTaken) {
            throw new HttpException(
                "This username is already registered.",
                HttpStatus.UNAUTHORIZED
            );
        }
        await this.userRepository.update(
            { username: previousUsername },
            { username: newUsername }
        );
        return "Username updated.";
    }

    async updateEmail(uuid: string, newEmail: string) {
        return await this.userRepository.update(
            { uuid: uuid },
            { email: newEmail }
        );
    }

    async validateEmail(uuid: string) {
        await this.userRepository.update({ uuid: uuid }, { valideEmail: true });
    }

    async deletePreviousProfileImage(uuid: string) {
        const image = (await this.getProfile(uuid)).profileImage;
        const path = join(process.cwd(), "./uploads/profile_pictures/" + image);
        fs.unlink(path, (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });
        return;
    }

    async updateProfileImage(uuid: string, imageName: string) {
        await this.userRepository.update(
            { uuid: uuid },
            { profileImage: imageName }
        );
        return "Image updated.";
    }

    async updateDoubleAuth(uuid: string, newValue: boolean) {
        await this.userRepository.update(
            { uuid: uuid },
            { twoFactorsAuth: newValue }
        );
        return "Setting updated.";
    }

    async getProfileImage(uuid: string) {
        let user = await this.getByID(uuid);
        if (user.profileImage === null) {
            let file = createReadStream(
                join(process.cwd(), "./default/profile_image.png")
            );
            const stream = new StreamableFile(file);
            return stream;
        } else {
            let file = createReadStream(
                join(
                    process.cwd(),
                    "./uploads/profile_pictures/" + user.profileImage
                )
            );
            const stream = new StreamableFile(file);
            return stream;
        }
    }

    async addFriend(userId: string, friend: string) {
        let user: UserEntity = await this.getByID(userId);
        if (userId === friend)
            throw new HttpException(
                "Can't be friend with yourself",
                HttpStatus.BAD_REQUEST
            );
        if (!user.friend) user.friend = new Array();
        else {
            if (user.friend.find((element) => element === friend)) {
                throw new HttpException(
                    "Already friend",
                    HttpStatus.BAD_REQUEST
                );
            }
        }
        user.friend.push(friend);
        await this.userRepository.update(
            { uuid: user.uuid },
            { friend: user.friend }
        );
        return "Friend added.";
    }

    async friendslist(userid: string) {
        let user = await this.getByID(userid);
        let list: string[] = new Array();

        if (!user.friend) return list;
        let i = 0;
        while (i < user.friend.length) {
            let id = user.friend[i];
            list.push(await this.getUsernameById(id));
            i++;
        }
        return list;
    }

    async DelFriend(userId: string, friend: string) {
        let user: UserEntity = await this.getByID(userId);
        if (userId === friend)
            throw new HttpException(
                "Can't unfriend yourself",
                HttpStatus.BAD_REQUEST
            );
        let index = user.friend.findIndex((element) => element === friend);
        if (index > -1) {
            user.friend.splice(index, 1);
        }
        await this.userRepository.update(
            { uuid: user.uuid },
            { friend: user.friend }
        );
        return "Friend deleted";
    }
}
