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
import { UserGateway } from "src/sockets/gateways/user.gateway";
import { GameInterface } from "src/game/interfaces/game.interface";
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        private userGateway: UserGateway
    ) {}

    // Get all the users in the database
    async getUsers(): Promise<UserEntity[]> {
        return await this.userRepository.find();
    }

    // uuid -> UserEntity || null
    async getByID(id: string): Promise<UserEntity | null> {
        return await this.userRepository.findOneBy({ uuid: id });
    }

    // username -> UserEntity || null
    async getByUsername(username: string): Promise<UserEntity | null> {
        return await this.userRepository.findOneBy({ username: username });
    }

    // id42 -> UserEntity || null
    async getById42(id42: number): Promise<UserEntity | null> {
        return await this.userRepository.findOneBy({ id42: id42 });
    }

    // uuid -> username
    async getUsernameById(id: string): Promise<string> {
        const user = await this.getByID(id);
        if (user) return user.username;
        return "";
    }

    // Delete an UserEntity from the database
    async deleteUser(uuid: string) {
        return await this.userRepository.delete({ uuid: uuid });
    }

    async getBySocket(socket: string): Promise<UserEntity | null> {
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
        const user: UserEntity | null = await this.getBySocket(socketID);
        if (!user) {
            return "";
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
            return "";
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
        let user: UserEntity | null = await this.getByUsername(username);
        if (user && status === "online") {
            return await this.userRepository.update(
                { uuid: user.uuid },
                { status: "online" }
            );
        }
    }

    async setStatusByID(uuid: string, status: string) {
        let user: UserEntity | null = await this.getByID(uuid);
        if (user) {
            await this.userRepository.update(
                { uuid: uuid },
                { status: status }
            );
            this.userGateway.sendStatus(user.username, status);
            return status;
        }
        return null;
    }

    async setStatusIfNotOffline(uuid: string, status: string) {
        let user: UserEntity | null = await this.getByID(uuid);
        if (user && user.status !== "offline") {
            await this.userRepository.update(
                { uuid: uuid },
                { status: status }
            );
            this.userGateway.sendStatus(user.username, status);
            return status;
        }
        return null;
    }

    async setStatus(socket: string, status: string) {
        let user: UserEntity | null = await this.getBySocket(socket);
        if (user) {
            if (status === "ingame") {
                await this.userRepository.update(
                    { uuid: user.uuid },
                    { status: "ingame" }
                );
            }
            if (status === "matchmaking") {
                await this.userRepository.update(
                    { uuid: user.uuid },
                    { status: "matchmaking" }
                );
            }
            return user.username;
        }
        return null;
    }

    async setSocketID(
        username: string,
        socket: string,
        status: string
    ): Promise<string> {
        let user: UserEntity | null = await this.getByUsername(username);
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
        const friend: UserEntity | null = await this.getByUsername(
            friendUsername
        );
        let user: UserEntity | null = await this.getByID(userId);
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
        const friend: UserEntity | null = await this.getByUsername(
            friendUsername
        );
        let user: UserEntity | null = await this.getByID(userId);
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
        let block: UserEntity | null = await this.getByUsername(
            blockedUsername
        );
        let user: UserEntity | null = await this.getByID(userId);
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
        let block: UserEntity | null = await this.getByUsername(
            blockedUsername
        );
        let user: UserEntity | null = await this.getByID(userId);
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

    // Save win / lose ratio
    async setScore(winner: UserEntity, loser: UserEntity) {
        winner.score.victory++;
        loser.score.defeat++;
        this.userRepository.update(
            { uuid: winner.uuid },
            { score: winner.score }
        );
        this.userRepository.update(
            { uuid: loser.uuid },
            { score: loser.score }
        );
    }

    // Save game history
    async saveGameResult(
        results: GameInterface,
        player1: string,
        player2: string
    ) {
        let user1 = await this.getByID(player1);
        let user2 = await this.getByID(player2);
        const [score1, score2] = [results.player1Score, results.player2Score];
        if (user1 && user2) {
            user1.xp += score1;
            user2.xp += score2;
            if (score1 > score2) {
                user1.xp += 5;
                await this.setScore(user1, user2);
                user1.history.push({
                    winner: user1.uuid,
                    loser: user2.uuid,
                    winner_score: score1,
                    loser_score: score2,
                });
                user2.history.push({
                    winner: user1.uuid,
                    loser: user2.uuid,
                    winner_score: score1,
                    loser_score: score2,
                });
            } else if (score2 > score1) {
                user2.xp += 5;
                await this.setScore(user2, user1);
                user1.history.push({
                    winner: user2.uuid,
                    loser: user1.uuid,
                    winner_score: score2,
                    loser_score: score1,
                });
                user2.history.push({
                    winner: user2.uuid,
                    loser: user1.uuid,
                    winner_score: score2,
                    loser_score: score1,
                });
            }
            await this.userRepository.update(
                { uuid: user1.uuid },
                { history: user1.history, xp: user1.xp }
            );
            await this.userRepository.update(
                { uuid: user2.uuid },
                { history: user2.history, xp: user2.xp }
            );
        }
        return;
    }

    // return the match history and convert uuid -> username
    async getGameHistory(user: UserEntity) {
        let history = user.history;
        for (let i = 0; i < history.length; i++) {
            if (history[i].winner === user.uuid) {
                const loser = await this.getByID(history[i].loser);
                if (loser) {
                    history[i].loser = loser.username;
                } else {
                    history[i].loser = "unknown";
                }
                history[i].winner = user.username;
            } else {
                const winner = await this.getByID(history[i].winner);
                if (winner) {
                    history[i].winner = winner.username;
                } else {
                    history[i].winner = "unknown";
                }
                history[i].loser = user.username;
            }
        }
        return history;
    }

    // Return a game leaderboard based on the user xp
    // victory => + 5 xp
    // 1 point => + 1 xp
    async getLeaderBoard() {
        let leaderboard: {
            rank: number;
            username: string;
            win: number;
            lose: number;
            xp: number;
        }[] = [];
        let users: UserEntity[] = await this.getUsers();
        if (!users) throw new UnauthorizedException("User not found");

        const sortedUsers: UserEntity[] = users.sort((user1, user2) => {
            if (user1.xp > user2.xp) {
                return -1;
            }
            if (user1.xp < user2.xp) {
                return 1;
            }
            return 0;
        });
        let rank = 1;
        for (let i = 0; i < sortedUsers.length; i++) {
            if (sortedUsers[i].history.length > 0) {
                leaderboard.push({
                    rank: rank,
                    username: sortedUsers[i].username,
                    win: sortedUsers[i].score.victory,
                    lose: sortedUsers[i].score.defeat,
                    xp: sortedUsers[i].xp,
                });
                if (
                    sortedUsers[i].status !== "offline" &&
                    sortedUsers[i].socketId.length > 0
                ) {
                    this.userGateway.rankUpdate(
                        rank,
                        sortedUsers[i].socketId[0]
                    );
                }
                if (i + 1 < sortedUsers.length) {
                    if (sortedUsers[i].xp > sortedUsers[i + 1].xp) {
                        rank++;
                    }
                }
            }
        }
        return leaderboard;
    }

    async getLeaderBoardRank(user: UserEntity): Promise<number> {
        let rank = 0;
        const leaderboard = await this.getLeaderBoard();

        if (leaderboard) {
            let index = leaderboard.findIndex(
                (element) => element.username === user.username
            );
            if (index !== -1) {
                rank = index + 1;
            }
        }
        return rank;
    }

    async addNotif(uuid: string, message: string, type: string) {
        const user = await this.getByID(uuid);
        if (user) {
            let notifs = user.notifications;
            notifs.push({ message: message, type: type });
            await this.userRepository.update(
                {
                    uuid: uuid,
                },
                {
                    notifications: notifs,
                }
            );
            this.userGateway.newNotification(user, message, type);
        }
    }

    async removeNotif(uuid: string, message: string, type: string) {
        let user = await this.getByID(uuid);
        if (!user) {
            throw new UnauthorizedException("User not found");
        }
        let notifs = user.notifications;
        let index = notifs.findIndex(
            (element) => element.message === message && element.type === type
        );
        if (index !== -1) {
            notifs.splice(index, 1);
            await this.userRepository.update(
                { uuid: uuid },
                { notifications: notifs }
            );
            this.userGateway.deleteNotification(user, message, type, index);
        }
    }
}
