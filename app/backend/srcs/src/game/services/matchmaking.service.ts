import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from "src/users/services/users.service";
import { GameEntity } from "../entities/game.entity";
import { UserEntity } from "src/users/entity/user.entity";
import { GameService, games } from "./game.service";
import { GameInterface } from "../interfaces/game.interface";
import { GameGateway } from "src/sockets/gateways/game.gateway";

@Injectable()
export class MatchmakingService {
    constructor(
        @InjectRepository(GameEntity)
        private gameRepository: Repository<GameEntity>,
        private userService: UsersService,
        private gameService: GameService,
        private gameGateway: GameGateway
    ) {}

    async joinQueue(uuid: string) {
        let user: UserEntity = await this.userService.getByID(uuid);
        if (!user) {
            throw new UnauthorizedException("User not found");
        }
        let game: GameEntity = await this.gameRepository.findOneBy({
            hostID: uuid,
        });
        if (!game) {
            game = await this.gameRepository.findOneBy({
                guestID: uuid,
            });
        }
        if (game) {
            if (game.status === "waiting") {
                throw new UnauthorizedException("Already in queue.");
            } else if (game.status === "playing") {
                let foundGame: GameInterface = games.get(game.uuid);
                if (foundGame) {
                    foundGame.disconnection = true;
                    games.set(game.uuid, foundGame);
                    return;
                }
                await this.gameRepository.remove(game);
            }
        }
        game = await this.gameRepository.findOneBy({
            status: "waiting",
        });
        if (!game) {
            game = new GameEntity();
            game.hostID = uuid;
            game.status = "waiting";
            await this.gameRepository.save(game);
            await this.userService.setStatusByID(uuid, "matchmaking");
        } else {
            game.guestID = uuid;
            game.status = "playing";
            await this.gameRepository.save(game);
            this.gameService.startGame(game);
        }
    }

    async cancelQueue(uuid: string) {
        let user: UserEntity = await this.userService.getByID(uuid);
        if (!user) {
            throw new UnauthorizedException("User not found");
        }
        let game: GameEntity = await this.gameRepository.findOneBy({
            hostID: uuid,
        });
        if (game && game.status === "waiting") {
            await this.gameRepository.remove(game);
            await this.userService.setStatusByID(uuid, "online");
            return;
        } else {
            game = await this.gameRepository.findOneBy({
                guestID: uuid,
            });
            if (game && game.status === "waiting") {
                await this.gameRepository.remove(game);
                await this.userService.setStatusByID(uuid, "online");
                return;
            }
        }
        throw new UnauthorizedException("Game not found");
    }

    leaveStream(user: UserEntity) {
        if (!user || user.socketId.length === 0) {
            throw new UnauthorizedException("User not found.");
        }
        games.forEach((value: GameInterface, key: string) => {
            if (
                value.watchersSockets.findIndex(
                    (socket: string) => socket === user.socketId[0]
                )
            ) {
                this.gameService.leaveStream(user.uuid, key);
                return;
            }
        });
    }

    async userDisconnection(user: UserEntity, recursive: boolean) {
        console.log("userDisconnection: ", user);
        let game: GameEntity;
        if (recursive === true) {
            game = await this.gameRepository.findOneBy({
                hostID: user.uuid,
                status: "waiting",
            });
            if (!game) {
                game = await this.gameRepository.findOneBy({
                    hostID: user.uuid,
                    status: "playing",
                });
            }
            this.leaveStream(user);
        } else {
            game = await this.gameRepository.findOneBy({
                guestID: user.uuid,
            });
        }
        if (game) {
            console.log("GAME =", game);
            if (game.status === "waiting") {
                await this.gameRepository.remove(game);
                return;
            } else if (game.status === "playing") {
                let foundGame: GameInterface = games.get(game.uuid);
                if (foundGame) {
                    foundGame.disconnection = true;
                    games.set(game.uuid, foundGame);
                    return;
                }
            }
        }
        if (recursive === true) {
            this.userDisconnection(user, false);
        }
    }

    // obtenir les 2 utilisateurs
    // verifier qu'il n'y ait pas deja une invitation
    // envoyer l'invitation
    async invitation(uuid: string, player2: string) {
        let host: UserEntity = await this.userService.getByID(uuid);
        let guest: UserEntity = await this.userService.getByUsername(player2);
        if (!host || !guest) {
            throw new UnauthorizedException("User not found");
        }
        var game: GameEntity = await this.gameRepository.findOneBy({
            hostID: uuid,
            status: "invitation",
            guestID: guest.uuid,
        });
        if (game) {
            throw new UnauthorizedException("Already invited");
        } else {
            game = await this.gameRepository.findOneBy({
                hostID: guest.uuid,
                status: "invitation",
                guestID: uuid,
            });
            if (game) {
                return await this.acceptInvitation(uuid, guest.username);
            }
        }
        game = new GameEntity();
        game.hostID = uuid;
        game.guestID = guest.uuid;
        game.status = "invitation";
        await this.gameRepository.save(game);
        await this.userService.addNotif(
            guest.uuid,
            host.username,
            "game invitation"
        );
    }

    async acceptInvitation(uuid: string, username: string) {
        let host: UserEntity = await this.userService.getByUsername(username);
        let guest: UserEntity = await this.userService.getByID(uuid);
        if (!host || !guest) {
            throw new UnauthorizedException("User not found");
        }
        if (
            (host.status === "online" || host.status === "matchmaking") &&
            guest.status === "online"
        ) {
            var game: GameEntity = await this.gameRepository.findOneBy({
                hostID: host.uuid,
                status: "invitation",
                guestID: guest.uuid,
            });
            if (game) {
                await this.userService.removeNotif(
                    uuid,
                    username,
                    "game invitation"
                );
                game.status = "playing";
                await this.gameRepository.save(game);
                await this.gameGateway.sendAcceptedInvitation(host.socketId);
                this.gameService.startGame(game);
            }
        } else {
            throw new UnauthorizedException("status !== 'online'");
        }
    }

    async denyInvitation(uuid: string, username: string) {
        let host: UserEntity = await this.userService.getByUsername(username);
        let guest: UserEntity = await this.userService.getByID(uuid);
        if (!host || !guest) {
            throw new UnauthorizedException("User not found");
        }
        var game: GameEntity = await this.gameRepository.findOneBy({
            hostID: host.uuid,
            status: "invitation",
            guestID: guest.uuid,
        });
        if (game) {
            await this.userService.removeNotif(
                uuid,
                username,
                "game invitation"
            );
            await this.gameRepository.delete(game);
        }
    }

    // return the games with status 'playing'
    async getCurrentGames(): Promise<
        {
            game_id: string;
            player1: string;
            player2: string;
        }[]
    > {
        let currentGames: {
            game_id: string;
            player1: string;
            player2: string;
        }[] = [];
        let game = await this.gameRepository.find();
        for (let i = 0; i < game.length; i++) {
            if (game[i].status === "playing") {
                let player1 = await this.userService.getByID(game[i].hostID);
                let player2 = await this.userService.getByID(game[i].guestID);
                if (player1 && player2) {
                    currentGames.push({
                        game_id: game[i].uuid,
                        player1: player1.username,
                        player2: player2.username,
                    });
                }
            }
        }
        return currentGames;
    }
}
