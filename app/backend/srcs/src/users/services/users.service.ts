import {
    HttpException,
    HttpStatus,
    Injectable,
    StreamableFile,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreatedFrom, UserEntity } from "../entity/user.entity";
import {} from "typeorm";
import { RegisterDto } from "src/auth/dtos/register.dto";
import * as bcrypt from "bcrypt";
import { createReadStream } from "fs";
import * as fs from "fs";
import { join } from "path";
import { MailerService } from "@nestjs-modules/mailer";
import { SocketService } from "src/sockets/socket.service";
import { GameService } from "src/game/services/game.service";
@Injectable()
export class UsersService {
    constructor(
        private readonly mailerService: MailerService,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        private socketService: SocketService,
        private gameService: GameService
    ) {}

    // Add an UserEntity into the database
    async saveUser(user): Promise<UserEntity> {
        if (user.createdFrom === CreatedFrom.REGISTER) {
            await this.sendVerificationMail(user);
        }
        return await this.userRepository.save(user);
    }

    // Delete an UserEntity from the database
    async deleteUser(uuid: string) {
        return this.userRepository.delete({ uuid: uuid });
    }

    // Get all the users in the database
    async getUsers(): Promise<UserEntity[]> {
        return await this.userRepository.find();
    }

    // Return the userEntity by uuid
    async getByID(id: string) {
        const user = await this.userRepository.findOneBy({ uuid: id });
        if (user) {
            return user;
        }
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    async getByUsername(username: string): Promise<UserEntity> {
        const user = await this.userRepository.findOneBy({
            username: username,
        });
        if (user) {
            return user;
        }
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    // Return the userEntity by it's 42uuid
    async getById42(id42: number): Promise<UserEntity> {
        const user = await this.userRepository.findOneBy({ id42: id42 });
        if (user) {
            return user;
        }
        return null;
    }

    // Return null if the username is unavailable
    async availableUsername(username: string): Promise<UserEntity> {
        const user: UserEntity = await this.userRepository.findOneBy({
            username: username,
        });
        return user ? user : null;
    }

    // Return the username by ID, throw an exception if not found
    async getUsernameById(id: string): Promise<string> {
        const user = await this.getByID(id);
        if (user) {
            return user.username;
        }
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    async getBySocket(socket: string): Promise<UserEntity> {
        let user: UserEntity[] = await this.userRepository.find();
        let i = 0;
        while (user[i]) {
            if (user[i].socketId) {
                if (user[i].socketId.find((element) => element === socket))
                    return user[i];
            }
            i++;
        }
        return null;
    }

    // Encode a password before storing it in the db
    async encode_password(rawPassword: string): Promise<string> {
        const saltRounds: number = 11;
        const salt = bcrypt.genSaltSync(saltRounds);
        return bcrypt.hashSync(rawPassword, salt);
    }

    // Set the doubleAuthentificationCode on an empty string
    async deleteEmailValidationCode(uuid: string) {
        await this.userRepository.update(
            { uuid: uuid },
            { emailValidationCode: "" }
        );
    }

    // Set the doubleAuthentificationCode on an empty string
    async delete2faCode(uuid: string) {
        await this.userRepository.update(
            { uuid: uuid },
            { doubleAuthentificationCode: "" }
        );
    }

    // Set firstLog on false
    async confirm_profile(uuid: string) {
        await this.userRepository.update({ uuid: uuid }, { firstLog: false });
    }

    // Set status of an user with it's socket
    async setStatus(socket: string, status: string) {
        let user: UserEntity = await this.getBySocket(socket);
        if (user) {
            if (status === "In_Game") {
                await this.userRepository.update(
                    { uuid: user.uuid },
                    { status: "In_Game" }
                );
            }
            if (status === "MatchMaking") {
                await this.userRepository.update(
                    { uuid: user.uuid },
                    { status: "MatchMaking" }
                );
            }
            return user.username;
        }
        return null;
    }

    // Update status and emit
    async setUserStatus(username: string, status: string) {
        await this.userRepository.update(
            { username: username },
            { status: status }
        );
        //await this.socketService.sendStatus(username, status);
    }

    // Set an user status as online
    async online(username: string, socket: string) {
        let user: UserEntity = await this.getByUsername(username);
        if (!user.socketId.find((userSockets) => userSockets === socket))
            user.socketId.push(socket);
        await this.userRepository.update(
            { uuid: user.uuid },
            { socketId: user.socketId, status: "Online" }
        );
        return await this.socketService.emit("isOnline", {
            message: user.username + "is online.",
            username: user.username,
        });
    }

    async setSocketID(username: string, socket: string, status: string) {
        let user: UserEntity = await this.getByUsername(username);
        if (status === "Online") {
            await this.setUserStatus(user.username, status);
        }
        if (!user.socketId.find((userSockets) => userSockets === socket))
            user.socketId.push(socket);
        await this.userRepository.update(
            { uuid: user.uuid },
            { socketId: user.socketId }
        );
    }

    // Remove the sockets in the database
    async clearSocket(userUuid: string) {
        this.userRepository.update({ uuid: userUuid }, { socketId: [] });
    }

    async userDisconnection(socket: string): Promise<string> {
        let user: UserEntity = await this.getBySocket(socket);
        if (user) {
            let i = 0;
            while (i < user.socketId.length) {
                //await this.socketService.disconnect_user(user.socketId[i]);
                i++;
            }
            await this.userRepository.update(
                { uuid: user.uuid },
                { socketId: [], status: "Offline" }
            );
            return user.username;
        }
        return null;
    }

    // Set a 2fa code and send an email
    async generateDoubleAuthCode(uuid: string) {
        const min = Math.ceil(100000);
        const max = Math.floor(999999);
        const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
        let user = await this.getByID(uuid);
        await this.userRepository.update(
            { uuid: uuid },
            {
                doubleAuthentificationCode: randomNumber.toString(),
                doubleAuthentificationCodeCreation: new Date(),
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
                    user.doubleAuthentificationCode, // plaintext body
                html:
                    "<div style='display:flex; flex-direction: column; justify-content:center; align-items: center;' >\
                        <h1>Welcome back " +
                    user.username +
                    " !</h1>\
                        <h3>Here is your double authentification code :</h3>\
                        <h2>" +
                    user.doubleAuthentificationCode +
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
        let db_user: UserEntity = await this.availableUsername(
            registerDto.username
        );
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

        if (db_user && db_user.username === registerDto.username) {
            if (db_user.valideEmail) {
                throw new HttpException(
                    "This username is already registered.",
                    HttpStatus.UNAUTHORIZED
                );
            } else {
                await this.userRepository.update(
                    { uuid: db_user.uuid },
                    {
                        email: user.email,
                        createdFrom: CreatedFrom.REGISTER,
                        password: user.password,
                        twoFactorsAuth: user.twoFactorsAuth,
                        doubleAuthentificationCodeCreation: new Date(),
                        emailValidationCode: user.emailValidationCode,
                    }
                );
                await this.sendVerificationMail(user);
                return db_user;
            }
        } else {
            return this.saveUser(user);
        }
    }

    // Send validation email
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
            .then(() => {
                return "Email send.";
            })
            .catch((err) => {
                console.log(err);
            });
        return "Email send";
    }

    // Resend the email-validation email
    async resendEmail(uuid: string) {
        const min = Math.ceil(100000);
        const max = Math.floor(999999);
        const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
        const user: UserEntity = await this.getByID(uuid);

        const now = new Date();
        const diff = now.valueOf() - user.emailValidationCodeCreation.valueOf();
        if (diff < 1000 * 60) {
            // 60 seconds
            return "Try again later";
        }
        await this.userRepository.update(
            { uuid: uuid },
            {
                emailValidationCode: randomNumber.toString(),
                emailValidationCodeCreation: new Date(),
            }
        );
        return await this.sendVerificationMail(user);
    }

    /* 
        Usernames can only have: 
        - Lowercase Letters (a-z) 
        - Numbers (0-9)
        - Dots (.)
        - Underscores (_)
    */
    isUserNameValid(username: string) {
        const res = /^[a-z0-9_\.]+$/.exec(username);
        const valid = !!res;
        return valid;
    }

    // Update the username, must be unique
    async updateUsername(uuid: string, newUsername: string) {
        if (!this.isUserNameValid(newUsername)) {
            throw new HttpException(
                "Usernames can only have: \n- Lowercase Letters (a-z)\n- Numbers (0-9)\n- Dots (.)\n- Underscores (_)",
                HttpStatus.UNAUTHORIZED
            );
        }
        let user: UserEntity = await this.getByID(uuid);
        let previousUsername: string = user.username;
        const alreadyTaken = await this.availableUsername(newUsername);
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
        //this.socketService.userUpdate(previousUsername, "username");
        return "Username updated.";
    }

    // Set the mail as valide (after validation)
    async validateEmail(uuid: string) {
        await this.userRepository.update({ uuid: uuid }, { valideEmail: true });
    }

    // Delete the previous avatar
    async deletePreviousProfileImage(uuid: string) {
        const user = await this.getByID(uuid);
        const image = user.profileImage;
        if (image) {
            const path = join(
                process.cwd(),
                "./uploads/profile_pictures/" + image
            );
            fs.unlink(path, (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
            });
        }
        return;
    }

    // Set a new image as avatar, delete the previous if non-null
    async updateProfileImage(uuid: string, imageName: string) {
        let user = await this.getByID(uuid);
        if (user.profileImage !== null) {
            await this.deletePreviousProfileImage(user.uuid);
        }
        await this.userRepository.update(
            { uuid: uuid },
            { profileImage: imageName }
        );
        //this.socketService.userUpdate(user.username, "avatar");
        return "Image updated.";
    }

    // Toogle 2fa
    async updateDoubleAuth(uuid: string) {
        const user = await this.getByID(uuid);
        const newValue = !user.twoFactorsAuth;
        await this.userRepository.update(
            { uuid: uuid },
            { twoFactorsAuth: newValue }
        );
        return newValue ? "2fa activated" : "2fa disabled";
    }

    async getUserImage(imageName: string | null): Promise<StreamableFile> {
        let path: string;
        if (imageName === null) {
            path = join(process.cwd(), "./default/profile_image.png");
        } else {
            path = join(
                process.cwd(),
                "./uploads/profile_pictures/" + imageName
            );
        }
        return new StreamableFile(createReadStream(path));
    }

    // Add an user to the friends list
    async addFriend(userId: string, friendUsername: string) {
        const friend: UserEntity = await this.getByUsername(friendUsername);
        let user: UserEntity = await this.getByID(userId);
        const frienId = friend.uuid;
        if (userId === frienId)
            throw new HttpException(
                "Can't be friend with yourself",
                HttpStatus.BAD_REQUEST
            );
        else if (user.friend.find((friends) => friends === frienId)) {
            throw new HttpException("Already friend", HttpStatus.BAD_REQUEST);
        }
        user.friend.push(frienId);
        await this.userRepository.update(
            { uuid: user.uuid },
            { friend: user.friend }
        );
        return this.friendslist(user.friend);
    }

    // Get the friends list as an array of objects, with usernames and status
    async friendslist(friends: string[]) {
        let list: { username: string; status: string }[] = new Array();
        let i = 0;
        while (i < friends.length) {
            let friend = await this.getByID(friends[i]);
            if (friend) {
                list.push({ username: friend.username, status: friend.status });
            }
            i++;
        }
        return list;
    }

    // Remove a friend
    async DelFriend(userId: string, friendUsername: string) {
        const friend: UserEntity = await this.getByUsername(friendUsername);
        let user: UserEntity = await this.getByID(userId);
        const frienId = friend.uuid;
        if (userId === frienId)
            throw new HttpException(
                "Can't unfriend yourself",
                HttpStatus.BAD_REQUEST
            );
        let index = user.friend.findIndex((friends) => friends === frienId);
        if (index > -1) {
            user.friend.splice(index, 1);
            await this.userRepository.update(
                { uuid: user.uuid },
                { friend: user.friend }
            );
        }
        return this.friendslist(user.friend);
    }

    // Add an user to the user's blocked list
    async blockUser(userId: string, blockedUsername: string) {
        let block: UserEntity = await this.getByUsername(blockedUsername);
        let user: UserEntity = await this.getByID(userId);
        const blockedId = block.uuid;
        if (userId === blockedId) {
            throw new HttpException(
                "You cannot block yourself",
                HttpStatus.BAD_REQUEST
            );
        } else if (user.blocked.find((blocked) => blocked === blockedId)) {
            throw new HttpException("Already blocked", HttpStatus.BAD_REQUEST);
        }
        let list = user.blocked;
        list.push(blockedId);
        await this.userRepository.update(
            { uuid: user.uuid },
            { blocked: list }
        );
        return await this.blockedList(list);
    }

    // Get the user's blocked users list
    async blockedList(list: string[]) {
        let blocked: { username: string }[] = [];
        let i = 0;
        while (i < list.length) {
            let blocked_user = await this.getByID(list[i]);
            if (blocked_user) {
                blocked.push({ username: blocked_user.username });
            }
            i++;
        }
        return blocked;
    }

    // Remove an user from the user's blocked list
    async unBlock(userId: string, blockedUsername: string) {
        let block: UserEntity = await this.getByUsername(blockedUsername);
        let user: UserEntity = await this.getByID(userId);
        const blockedId = block.uuid;
        if (userId === blockedId)
            throw new HttpException(
                "Can't unblock yourself",
                HttpStatus.BAD_REQUEST
            );
        let index = user.blocked.findIndex((blocked) => blocked === blockedId);
        if (index > -1) {
            user.blocked.splice(index, 1);
            await this.userRepository.update(
                { uuid: user.uuid },
                { blocked: user.blocked }
            );
        }
        return this.blockedList(user.blocked);
    }
}
