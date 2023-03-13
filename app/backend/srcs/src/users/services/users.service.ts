import {
    HttpException,
    HttpStatus,
    Injectable,
    StreamableFile,
    UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "../entity/user.entity";
import {} from "typeorm";
import { createReadStream } from "fs";
import * as fs from "fs";
import { join } from "path";
import { SocketService } from "src/sockets/gateways/socket.gateway";
import { UserGateway } from "src/sockets/gateways/user.gateway";
import { ConnectionGateway } from "src/sockets/gateways/connection.gateway";
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        private socketService: SocketService,
        private userGateway: UserGateway
    ) {}

    // Get all the users in the database
    async getUsers(): Promise<UserEntity[]> {
        return await this.userRepository.find();
    }

    // uuid -> UserEntity || null
    async getByID(id: string) {
        return await this.userRepository.findOneBy({ uuid: id });
    }

    // username -> UserEntity || null
    async getByUsername(username: string): Promise<UserEntity> {
        return await this.userRepository.findOneBy({ username: username });
    }

    // id42 -> UserEntity || null
    async getById42(id42: number): Promise<UserEntity> {
        return await this.userRepository.findOneBy({ id42: id42 });
    }

    // uuid -> username
    async getUsernameById(id: string): Promise<string> {
        const user = await this.getByID(id);
        if (user) return user.username;
        return null;
    }

    // Delete an UserEntity from the database
    async deleteUser(uuid: string) {
        return await this.userRepository.delete({ uuid: uuid });
    }

    async getBySocket(socket: string): Promise<UserEntity> {
        let user: UserEntity[] = await this.userRepository.find();
        let i = 0;
        while (user[i]) {
            if (user[i].socketId.find((element) => element === socket))
                return user[i];
            i++;
        }
        return null;
    }

    // When a client connexion is closed
    async close(socketID: string): Promise<string> {
        const user: UserEntity = await this.getBySocket(socketID);
        if (!user) {
            return null;
        }
        let sockets = user.socketId;
        let index = sockets.findIndex((socket) => socket === socketID);
        if (index !== -1) {
            sockets.slice(index, 1);
        }
        if (sockets.length > 0) {
            await this.userRepository.update(
                { uuid: user.uuid },
                { socketId: sockets }
            );
            return null;
        } else {
            await this.userRepository.update(
                { uuid: user.uuid },
                { status: "offline", socketId: sockets }
            );
            return user.username;
        }
    }

    // Set the status on 'online' and save the socket id
    async login(uuid: string, socketID: string[]) {
        return await this.userRepository.update(
            { uuid: uuid },
            { status: "online", socketId: socketID }
        );
    }

    // Set the status on 'offline' and delete the socket id
    async logout(uuid: string) {
        await this.userRepository.update(
            { uuid: uuid },
            { status: "offline", socketId: [] }
        );
    }

    async user_status(username: string, status: string) {
        let user: UserEntity = await this.getByUsername(username);
        if (status === "online") {
            return await this.userRepository.update(
                { uuid: user.uuid },
                { status: "online" }
            );
        }
    }

    async setStatus(socket: string, status: string) {
        let user: UserEntity = await this.getBySocket(socket);
        if (user) {
            if (status === "In_Game") {
                await this.userRepository.update(
                    { uuid: user.uuid },
                    { status: "ingame" }
                );
            }
            if (status === "MatchMaking") {
                await this.userRepository.update(
                    { uuid: user.uuid },
                    { status: "matchmaking" }
                );
            }
            return user.username;
        }
        return null;
    }

    async updatePlayerStatus(userID: string, status: string) {
        let player = await this.getByID(userID);
        await this.userRepository.update(
            { uuid: player.uuid },
            { status: status }
        );
        await this.socketService.sendStatus(player.username, status);
    }

    async setSocketID(
        username: string,
        socket: string,
        status: string
    ): Promise<string> {
        let user: UserEntity = await this.getByUsername(username);
        if (user) {
            await this.user_status(user.username, status);
            if (!user.socketId) user.socketId = new Array();
            if (!user.socketId.find((element) => element === socket))
                user.socketId.push(socket);
            await this.userRepository.update(
                { uuid: user.uuid },
                { socketId: user.socketId }
            );
            return user.username;
        }
        throw new HttpException("Invalid user", HttpStatus.FOUND);
    }

    async clearSocket(userUuid: string) {
        await this.userRepository.update({ uuid: userUuid }, { socketId: [] });
    }

    async userDisconnection(socket: string): Promise<string> {
        let user: UserEntity = await this.getBySocket(socket);
        if (user) {
            let i = 0;
            while (i < user.socketId.length) {
                await this.socketService.disconnect_user(user.socketId[i]);
                i++;
            }
            await this.userRepository.update(
                { uuid: user.uuid },
                { socketId: [], status: "offline" }
            );
            user.status = "offline";
            return user.username;
        }
        return null;
    }

    // Set a new username
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
        return this.userGateway.updateUsername(previousUsername, newUsername);
    }

    // Toogle 2fa
    async updateDoubleAuth(uuid: string) {
        const user = await this.getByID(uuid);
        if (!user) {
            throw new UnauthorizedException("User not found");
        }
        const newValue = !user.twoFactorsAuth;
        await this.userRepository.update(
            { uuid: uuid },
            { twoFactorsAuth: newValue }
        );
        return newValue;
    }

    // Return an image
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

    // Set a new image as avatar, delete the previous if non-null
    async updateProfileImage(uuid: string, imageName: string) {
        let user = await this.getByID(uuid);
        if (!user) {
            throw new UnauthorizedException("User not found");
        }
        if (user.profileImage !== null) {
            await this.deletePreviousProfileImage(user.uuid);
        }
        await this.userRepository.update(
            { uuid: uuid },
            { profileImage: imageName }
        );
        return this.userGateway.updateAvatar(user.username);
    }

    // Delete the previous avatar
    async deletePreviousProfileImage(uuid: string) {
        const user = await this.getByID(uuid);
        if (!user) {
            throw new UnauthorizedException("User not found");
        }
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

    // Set firstlog as false in the database
    async confirm_profile(uuid: string) {
        await this.userRepository.update({ uuid: uuid }, { firstLog: false });
    }

    // Add an user to the friends list
    async addFriend(userId: string, friendUsername: string) {
        const friend: UserEntity = await this.getByUsername(friendUsername);
        let user: UserEntity = await this.getByID(userId);
        if (!user || !friend) {
            throw new UnauthorizedException("User not found");
        }
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
        return { username: friend.username, status: friend.status };
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
        if (!user || !friend) {
            throw new UnauthorizedException("User not found");
        }
        const frienId = friend.uuid;
        if (userId === frienId)
            throw new HttpException(
                "Can't unfriend yourself",
                HttpStatus.BAD_REQUEST
            );
        let index = user.friend.findIndex((friends) => friends === frienId);
        if (index === -1) {
            throw new UnauthorizedException("This user wasn't your friend.");
        }
        user.friend.splice(index, 1);
        await this.userRepository.update(
            { uuid: user.uuid },
            { friend: user.friend }
        );
        return this.friendslist(user.friend);
    }

    // Add an user to the user's blocked list
    async blockUser(userId: string, blockedUsername: string) {
        let block: UserEntity = await this.getByUsername(blockedUsername);
        let user: UserEntity = await this.getByID(userId);
        if (!user || !block) {
            throw new UnauthorizedException("User not found");
        }
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
        if (!user || !block) {
            throw new UnauthorizedException("User not found");
        }
        const blockedId = block.uuid;
        if (userId === blockedId)
            throw new HttpException(
                "Can't unblock yourself",
                HttpStatus.BAD_REQUEST
            );
        let index = user.blocked.findIndex((blocked) => blocked === blockedId);
        if (index === -1) {
            throw new UnauthorizedException("This user wasn't blocked.");
        }
        user.blocked.splice(index, 1);
        await this.userRepository.update(
            { uuid: user.uuid },
            { blocked: user.blocked }
        );
        return this.blockedList(user.blocked);
    }
}
