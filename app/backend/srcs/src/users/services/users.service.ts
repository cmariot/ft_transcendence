import {
    HttpException,
    HttpStatus,
    Injectable,
    StreamableFile,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreatedFrom, UserEntity } from "../entity/user.entity";
import { FriendshipEntity } from "../entity/friendship.entity";
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
        private readonly mailerService: MailerService,
		@InjectRepository(FriendshipEntity)
    	private friendshipRepository: Repository<FriendshipEntity>
    ) {}

	FriendshipEntity = FriendshipEntity;

    async sendVerificationMail(user) {
        this.mailerService
            .sendMail({
                to: user.email, // list of receivers
                from: process.env.EMAIL, // sender address
                subject: "Validate your account - ft_transcendence", // Subject line
                text:
                    "Welcome to ft_transcendence, validate your account with this code :" +
                    user.emailValidationCode, // plaintext body
                html:
                    "<h1>Welcome to ft_transcendence</h1>\
                        <p>Validate your account with this code : <b>" +
                    user.emailValidationCode +
                    "<b /></p", // HTML body content
            })
            .then((success) => {
                console.log(success);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    // Add an UserEntity into the database
    async saveUser(user): Promise<UserEntity> {
        if (user.createdFrom === CreatedFrom.REGISTER) {
            this.sendVerificationMail(user);
            console.log("CODE = ", user.emailValidationCode);
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

    async encode_password(rawPassword: string): Promise<string> {
        const saltRounds: number = 11;
        const salt = bcrypt.genSaltSync(saltRounds);
        return bcrypt.hashSync(rawPassword, salt);
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
        };
        return this.saveUser(user);
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
        console.log("Email is now valide.");
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

    async getProfileImage(uuid: string) {
        let user = await this.getByID(uuid);
        if (user.profileImage === null) {
            const file = createReadStream(
                join(process.cwd(), "./default/profile_image.png")
            );
            return new StreamableFile(file);
        } else {
            const file = createReadStream(
                join(
                    process.cwd(),
                    "./uploads/profile_pictures/" + user.profileImage
                )
            );
            return new StreamableFile(file);
        }
    }

	async addFriend(user: UserEntity, friend: UserEntity){
		
		let userUuid = user.uuid;
		let friendUuid = friend.uuid;
		const existingFriendship = await this.friendshipRepository
    	.createQueryBuilder("friendship")
   		.innerJoin("friendship.user", "user")
		.where("user.uuid = :userUuid", { userUuid })
		.andWhere("friendship.friendUuid = :friendUuid", { friendUuid })
		.getOne();

  		if (existingFriendship) {
			throw new HttpException("Friend already exist.", HttpStatus.FOUND);
  		}

		const friendship = new this.FriendshipEntity();
		friendship.user = user;
		friendship.friendUuid = friend.uuid;
	
		await this.friendshipRepository.save(friendship);
		return ("Friend added !");
	}

	async friendslist(req: UserEntity){
		const user = req.username;
		const friends = await this.friendshipRepository
		.createQueryBuilder("friendship")
		.innerJoin("friendship.user", "user")
		.innerJoin("friendship.friend", "friend")
		.where("user.uuid = :uuid", { uuid: req.uuid })
		.select([ "friend.uuid as uuid" ])
		.getMany();

		return (friends);
	}
}