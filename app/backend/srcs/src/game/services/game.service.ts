import {
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    forwardRef,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from "src/users/services/users.service";
import { GameEntity } from "../entities/game.entity";
import { InvitationDto, InvitationResponseDto } from "../dtos/GameUtility.dto";
import { UserEntity } from "src/users/entity/user.entity";
import { SocketService } from "src/sockets/socket.service";

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(GameEntity)
        private gameRepository: Repository<GameEntity>,
        @Inject(forwardRef(() => UsersService))
        private userService: UsersService,
        @Inject(forwardRef(() => SocketService))
        private socketService: SocketService
    ) {}

    async joinQueue(username: string) {
        let player: UserEntity = await this.userService.getByUsername(username);
        if (!player) {
            throw new HttpException("User not found", HttpStatus.NOT_FOUND);
        }
        if (
            (await this.gameRepository.findOneBy({ HostID: player.uuid })) ||
            (await this.gameRepository.findOneBy({ GuestID: player.uuid }))
        ) {
            throw new HttpException("Already in queue", HttpStatus.BAD_REQUEST);
        }
        let game: GameEntity = await this.gameRepository.findOneBy({
            status: "waiting",
        });
        if (!game) {
            game = new GameEntity();
            game.HostID = player.uuid;
            game.status = "waiting";
            await this.updatePlayerStatus(game.HostID, "MatchMaking");
            await this.gameRepository.save(game);
            return "In Queue";
        } else if (game) {
            game.GuestID = player.uuid;
            game.status = "playing";
            await this.updatePlayerStatus(game.GuestID, "MatchMaking");
            this.gameRepository.save(game);
            //startGame() function qui va lancer la game en envoyant des sockets de confirmation aux 2 joueurs
            return "You found a match";
        }
    }

    async cancelQueue(player: UserEntity) {
        let game: GameEntity = await this.gameRepository.findOneBy({
            HostID: player.uuid,
        });
        if (!game) {
            game = await this.gameRepository.findOneBy({
                GuestID: player.uuid,
            });
        }
        if (!game) {
            throw new HttpException("Not in Queue", HttpStatus.UNAUTHORIZED);
        }
        if (game.HostID) {
            await this.updatePlayerStatus(game.HostID, "Online");
            player = await this.userService.getByID(game.HostID);
            //await this.socketService.sendCancel(
            //    player.socketId[0],
            //    "queueCancel"
            //);
        }
        if (game.GuestID) {
            await this.updatePlayerStatus(game.GuestID, "Online");
            player = await this.userService.getByID(game.GuestID);
            //await this.socketService.sendCancel(
            //    player.socketId[0],
            //    "queueCancel"
            //);
        }
        await this.gameRepository.remove(game);
        return "CancelSuccess";
    }

    async invitation(users: InvitationDto) {
        let host: UserEntity = await this.userService.getByUsername(users.host);
        let guest: UserEntity = await this.userService.getByUsername(
            users.guest
        );
        if (!host) {
            throw new HttpException(
                "Host do not exist",
                HttpStatus.BAD_REQUEST
            );
        }
        if (!guest) {
            throw new HttpException(
                "Guest do not exist",
                HttpStatus.BAD_REQUEST
            );
        }
        let game: GameEntity;
        game.HostID = host.uuid;
        await this.gameRepository.save(game);
        await this.updatePlayerStatus(game.HostID, "MatchMaking");
        //await this.socketService.sendInvitation(guest.socketId[0], host.uuid);
        return "Invitation pending";
    }

    async ResponseInvitation(users: InvitationResponseDto) {
        if (!users.response) {
            let host: UserEntity = await this.userService.getByID(users.hostID);
            return await this.cancelQueue(host);
        }
        let game: GameEntity = await this.gameRepository.findOneBy({
            HostID: users.hostID,
        });
        if (!game) {
            throw new HttpException(
                "Host Game do not exist",
                HttpStatus.NOT_FOUND
            );
        }
        let guest: UserEntity = await this.userService.getByUsername(
            users.guest
        );
        game.GuestID = guest.uuid;
        await this.updatePlayerStatus(game.HostID, "MatchMaking");
        await this.gameRepository.save(game);
        //start game()
        return "Game accepted";
    }

    async handleDisconnect(DiscoUser: UserEntity) {
        let game: GameEntity = await this.gameRepository.findOneBy({
            HostID: DiscoUser.uuid,
        });
        if (game) {
            let guest: UserEntity = await this.userService.getByID(
                game.GuestID
            );
            if (guest.status === "In_Game") {
                // await this.socketService.sendEndGameStatus(
                //     guest.socketId[0],
                //     "Victory by Disconnection",
                //     true
                // );
            } else if (guest.status === "MatchMaking") {
                //this.socketService.sendCancel(guest.socketId[0], "Cancel");
            }
            await this.updatePlayerStatus(guest.uuid, "Online");
            this.gameRepository.remove(game);
            return "OHOHOH";
        } else if (!game) {
            game = await this.gameRepository.findOneBy({
                GuestID: DiscoUser.uuid,
            });
            if (game) {
                let host: UserEntity = await this.userService.getByID(
                    game.HostID
                );
                if (host.status === "In_Game") {
                    // await this.socketService.sendEndGameStatus(
                    //     host.socketId[0],
                    //     "Victory by Disconnection",
                    //     true
                    // );
                } else if (host.status === "MatchMaking") {
                    //this.socketService.sendCancel(host.socketId[0], "Cancel");
                }
                await this.updatePlayerStatus(host.uuid, "Online");
                this.gameRepository.remove(game);
                return "OHOHOH";
            }
        }
        return "Wtf";
    }

    async updatePlayerStatus(userID: string, status: string) {
        let player = await this.userService.getByID(userID);
        return this.userService.setUserStatus(player.username, status);
    }
}
