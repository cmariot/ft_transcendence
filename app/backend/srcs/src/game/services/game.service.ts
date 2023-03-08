import {
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from "src/users/services/users.service";
import { GameEntity } from "../entities/game.entity";
import {
    InvitationDto,
    InvitationResponseDto,
    UsernameDto,
} from "../dtos/GameUtility.dto";
import { GameGateway } from "../gateways/GameGateways";
import { UserEntity } from "src/users/entity/user.entity";

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(GameEntity)
        private gameRepository: Repository<GameEntity>,
        private userService: UsersService,
        private GameGateway: GameGateway
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
            await this.userService.updatePlayerStatus(
                game.HostID,
                "MatchMaking"
            );
            await this.gameRepository.save(game);
            return "In Queue";
        } else if (game) {
            game.GuestID = player.uuid;
            game.status = "playing";
            await this.userService.updatePlayerStatus(
                game.GuestID,
                "MatchMaking"
            );
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
            await this.userService.updatePlayerStatus(game.HostID, "Online");
            player = await this.userService.getByID(game.HostID);
            await this.GameGateway.sendCancel(
                player.socketId[0],
                "queueCancel"
            );
        }
        if (game.GuestID) {
            await this.userService.updatePlayerStatus(game.GuestID, "Online");
            player = await this.userService.getByID(game.GuestID);
            await this.GameGateway.sendCancel(
                player.socketId[0],
                "queueCancel"
            );
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
        await this.userService.updatePlayerStatus(game.HostID, "MatchMaking");
        await this.GameGateway.sendInvitation(guest.socketId[0], host.uuid);
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
        await this.userService.updatePlayerStatus(game.HostID, "MatchMaking");
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
                await this.GameGateway.sendEndGameStatus(
                    guest.socketId[0],
                    "Victory by Disconnection",
                    true
                );
            } else if (guest.status === "MatchMaking") {
                this.GameGateway.sendCancel(guest.socketId[0], "Cancel");
            }
            await this.userService.updatePlayerStatus(guest.uuid, "Online");
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
                    await this.GameGateway.sendEndGameStatus(
                        host.socketId[0],
                        "Victory by Disconnection",
                        true
                    );
                } else if (host.status === "MatchMaking") {
                    this.GameGateway.sendCancel(host.socketId[0], "Cancel");
                }
                await this.userService.updatePlayerStatus(host.uuid, "Online");
                this.gameRepository.remove(game);
                return "OHOHOH";
            }
        }
        return "Wtf";
    }
}
