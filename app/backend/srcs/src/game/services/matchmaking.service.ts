import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from "src/users/services/users.service";
import { GameEntity } from "../entities/game.entity";
import { UserEntity } from "src/users/entity/user.entity";
import { GameService, games } from "./game.service";
import { GameInterface } from "../interfaces/game.interface";
import { GameGateway } from "src/sockets/gateways/game.gateway";
import { gameOptionsDTO } from "../dtos/GameUtility.dto";

@Injectable()
export class MatchmakingService {
    constructor(
        @InjectRepository(GameEntity)
        private gameRepository: Repository<GameEntity>,
        private userService: UsersService,
        private gameService: GameService,
        private gameGateway: GameGateway
    ) {}

    // Join the matchmaking queue
    async joinQueue(
        uuid: string,
        options: { power_up: boolean; solo: boolean }
    ) {
        let user: UserEntity | null = await this.userService.getByID(uuid);
        if (!user) {
            throw new UnauthorizedException("User not found");
        }
        let game: GameEntity | null = await this.gameRepository.findOneBy({
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
                let foundGame: GameInterface | undefined = games.get(game.uuid);
                if (foundGame) {
                    foundGame.disconnection = true;
                    games.set(game.uuid, foundGame);
                    await this.gameRepository.remove(game);
                }
            }
        }
        if (options.solo === true) {
            game = new GameEntity();
            game.hostID = uuid;
            game.guestID = uuid;
            game.options = options;
            game.status = "playing";
            await this.gameRepository.save(game);
            this.gameService.startGame(game);
            return;
        }
        let waitingGames: GameEntity[] = await this.gameRepository.findBy({
            status: "waiting",
        });
        if (waitingGames) {
            for (let i = 0; i < waitingGames.length; i++) {
                if (waitingGames[i].options.power_up === options.power_up) {
                    waitingGames[i].guestID = uuid;
                    waitingGames[i].status = "playing";
                    await this.gameRepository.save(waitingGames[i]);
                    this.gameService.startGame(waitingGames[i]);
                    return;
                }
            }
        }
        game = new GameEntity();
        game.hostID = uuid;
        game.status = "waiting";
        game.options = options;
        await this.gameRepository.save(game);
        await this.userService.setStatusByID(uuid, "matchmaking");
        return;
    }

    async cancelQueue(uuid: string) {
        let user: UserEntity | null = await this.userService.getByID(uuid);
        if (!user) {
            throw new UnauthorizedException("User not found");
        }
        let game: GameEntity | null = await this.gameRepository.findOneBy({
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
        let game: GameEntity[];
        if (recursive === true) {
            game = await this.gameRepository.findBy({
                hostID: user.uuid,
            });
            this.leaveStream(user);
        } else {
            game = await this.gameRepository.findBy({
                guestID: user.uuid,
            });
        }
        if (game && game.length > 0) {
            for (let i = 0; i < game.length; i++) {
                if (game[i].status === "waiting") {
                    await this.gameRepository.remove(game);
                    return;
                } else if (game[i].status === "playing") {
                    let foundGame: GameInterface | undefined = games.get(
                        game[i].uuid
                    );
                    if (foundGame) {
                        foundGame.disconnection = true;
                        games.set(game[i].uuid, foundGame);
                        return;
                    }
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
        let host: UserEntity | null = await this.userService.getByID(uuid);
        let guest: UserEntity | null = await this.userService.getByUsername(
            player2
        );
        if (!host || !guest) {
            throw new UnauthorizedException("User not found");
        }
        var game: GameEntity | null = await this.gameRepository.findOneBy({
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
        let host: UserEntity | null = await this.userService.getByUsername(
            username
        );
        let guest: UserEntity | null = await this.userService.getByID(uuid);
        if (!host || !guest) {
            throw new UnauthorizedException("User not found");
        }
        if (
            (host.status === "online" || host.status === "matchmaking") &&
            (guest.status === "online" || guest.status === "matchmaking")
        ) {
            var game: GameEntity | null = await this.gameRepository.findOneBy({
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
            if (guest.status !== "online" && guest.status !== "matchmaking") {
                throw new UnauthorizedException(
                    "You cannot accept the invitation when you're " +
                        guest.status
                );
            } else {
                throw new UnauthorizedException(
                    "Your opponent is " + host.status
                );
            }
        }
    }

    async denyInvitation(uuid: string, username: string) {
        let host: UserEntity | null = await this.userService.getByUsername(
            username
        );
        let guest: UserEntity | null = await this.userService.getByID(uuid);
        if (!host || !guest) {
            throw new UnauthorizedException("User not found");
        }
        var game: GameEntity | null = await this.gameRepository.findOneBy({
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
                if (player1) {
                    if (game[i].options.solo === true) {
                        currentGames.push({
                            game_id: game[i].uuid,
                            player1: player1.username,
                            player2: "gigachad",
                        });
                    } else {
                        let player2 = await this.userService.getByID(
                            game[i].guestID
                        );
                        if (player2) {
                            currentGames.push({
                                game_id: game[i].uuid,
                                player1: player1.username,
                                player2: player2.username,
                            });
                        }
                    }
                }
            }
        }
        return currentGames;
    }
}
