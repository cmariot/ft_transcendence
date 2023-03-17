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
import { InvitationDto, InvitationResponseDto } from "../dtos/GameUtility.dto";
import { GameGateway } from "../../sockets/gateways/game.gateway";
import { UserEntity } from "src/users/entity/user.entity";
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@Injectable()
@WebSocketGateway(3001, { cors: { origin: "https://localhost:8443" } })
export class GameService {
    constructor(
        @InjectRepository(GameEntity)
        private gameRepository: Repository<GameEntity>,
        private userService: UsersService,
        private gameGateway: GameGateway
    ) {}

    @WebSocketServer()
    server: Server;

    async joinQueue(username: string) {
        let player: UserEntity = await this.userService.getByUsername(username);
        if (!player) {
            throw new HttpException("User not found", HttpStatus.NOT_FOUND);
        }
        if (
            (await this.gameRepository.findOneBy({ hostID: player.uuid })) ||
            (await this.gameRepository.findOneBy({ guestID: player.uuid }))
        ) {
            throw new HttpException("Already in queue", HttpStatus.BAD_REQUEST);
        }
        let game: GameEntity = await this.gameRepository.findOneBy({
            status: "waiting",
        });
        if (!game) {
            game = new GameEntity();
            game.hostID = player.uuid;
            game.status = "waiting";

            await this.userService.setStatusByID(game.hostID, "matchmaking");
            await this.gameRepository.save(game);
            return "In Queue";
        } else if (game) {
            game.guestID = player.uuid;
            game.status = "playing";
            await this.userService.setStatusByID(game.guestID, "matchmaking");
            await this.gameRepository.save(game);
            this.startGame(game);
            return "You found a match";
        }
    }

    async cancelQueue(username: string) {
        let player: UserEntity = await this.userService.getByUsername(username);
        if (!player) {
            throw new HttpException("User not found", HttpStatus.NOT_FOUND);
        }
        let game: GameEntity = await this.gameRepository.findOneBy({
            hostID: player.uuid,
        });
        if (!game) {
            game = await this.gameRepository.findOneBy({
                guestID: player.uuid,
            });
        }
        if (!game) {
            throw new HttpException("Not in Queue", HttpStatus.UNAUTHORIZED);
        }

        if (game.hostID) {
            player = await this.userService.getByID(game.hostID);
            await this.userService.setStatusByID(game.hostID, "online");
            await this.gameGateway.sendCancel(
                player.socketId[0],
                "queueCancel"
            );
        }
        if (game.guestID) {
            await this.userService.setStatusByID(game.guestID, "online");
            player = await this.userService.getByID(game.guestID);
            await this.gameGateway.sendCancel(
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
        game.hostID = host.uuid;
        await this.gameRepository.save(game);
        await this.userService.setStatusByID(game.hostID, "matchmaking");
        await this.gameGateway.sendInvitation(guest.socketId[0], host.uuid);
        return "Invitation pending";
    }

    async ResponseInvitation(users: InvitationResponseDto) {
        if (!users.response) {
            let host: UserEntity = await this.userService.getByID(users.hostID);
            return await this.cancelQueue(host.username);
        }
        let game: GameEntity = await this.gameRepository.findOneBy({
            hostID: users.hostID,
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
        game.guestID = guest.uuid;
        await this.userService.setStatusByID(game.hostID, "matchmaking");
        await this.gameRepository.save(game);
        this.startGame(game);
        return "Game accepted";
    }

    async handleDisconnect(DiscoUser: UserEntity) {
        let game: GameEntity = await this.gameRepository.findOneBy({
            hostID: DiscoUser.uuid,
        });
        if (game) {
            if (game.guestID) {
                let guest: UserEntity = await this.userService.getByID(
                    game.guestID
                );
                if (guest.status === "ingame") {
                    await this.gameGateway.sendEndGameStatus(
                        guest.socketId[0],
                        "Victory by Disconnection",
                        true
                    );
                } else if (guest.status === "matchmaking") {
                    this.gameGateway.sendCancel(guest.socketId[0], "Cancel");
                }
            }
            //await this.userService.updatePlayerStatus(guest.uuid, "Online");
            this.gameRepository.remove(game);
            return "OHOHOH";
        } else if (!game) {
            game = await this.gameRepository.findOneBy({
                guestID: DiscoUser.uuid,
            });
            if (game) {
                if (game.hostID) {
                    let host: UserEntity = await this.userService.getByID(
                        game.hostID
                    );
                    if (host.status === "ingame") {
                        await this.gameGateway.sendEndGameStatus(
                            host.socketId[0],
                            "Victory by Disconnection",
                            true
                        );
                    } else if (host.status === "matchmaking") {
                        this.gameGateway.sendCancel(host.socketId[0], "Cancel");
                    }
                }
                //    await this.userService.updatePlayerStatus(host.uuid, "Online");
                this.gameRepository.remove(game);
                return "OHOHOH";
            }
        }
        return "Wtf";
    }

    private pos = new Map<
        string,
        {
            player1: number;
            player2: number;
            ball: { x: number; y: number };
            direction: { dx: number; dy: number }; // motion vector
            speed: {};
            player1ID: string;
            player2ID: string;
        }
    >();

    @SubscribeMessage("down")
    async moveDown(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { gameID: string }
    ) {
        let gamePos = this.pos.get(data.gameID);
        if (gamePos) {
            if (client.id === gamePos.player1ID) {
                if (gamePos.player1 > 0) {
                    gamePos.player1 = gamePos.player1 - 5;
                }
            } else if (client.id === gamePos.player2ID) {
                if (gamePos.player2 > 0) {
                    gamePos.player2 = gamePos.player2 - 5;
                }
            }
            this.pos.set(data.gameID, gamePos);
        }
    }

    @SubscribeMessage("up")
    async moveUp(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { gameID: string }
    ) {
        let gamePos = this.pos.get(data.gameID);
        if (gamePos) {
            if (client.id === gamePos.player1ID) {
                if (gamePos.player1 < 100) {
                    gamePos.player1 = gamePos.player1 + 5;
                }
            } else if (client.id === gamePos.player2ID) {
                if (gamePos.player2 < 100) {
                    gamePos.player2 = gamePos.player2 + 5;
                }
            }
            this.pos.set(data.gameID, gamePos);
        }
    }

    async timeout(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async countDown(player1Socket: string, player2Socket: string) {
        for (let i = 5; i >= 0; i--) {
            this.gameGateway.updateCountDown(
                player1Socket,
                player2Socket,
                "countDown",
                i
            );
            await this.timeout(1000);
        }
    }

    async game(player1Socket: string, player2Socket: string, gameID: string) {
        while (true) {
            let pos = this.pos.get(gameID);
            if (pos) {
                this.gameGateway.sendPos(player1Socket, player2Socket, pos);
            }
            await this.timeout(16);
        }
    }

    async play(player1Socket: string, player2Socket: string, gameID: string) {
        while (1) {
            this.game(player1Socket, player2Socket, gameID);
        }
    }

    async startGame(game: GameEntity) {
        const player1 = await this.userService.getByID(game.hostID);
        const player2 = await this.userService.getByID(game.guestID);
        if (!player1 || !player2) {
            throw new UnauthorizedException("User not found");
        }
        await this.userService.setStatusByID(game.hostID, "ingame");
        this.pos.set(game.uuid, {
            player1: 50,
            player2: 50,
            ball: { x: 50, y: 50 },
            player1ID: player1.socketId[0],
            player2ID: player2.socketId[0],
        });
        await this.gameGateway.sendGameID(
            player1.socketId[0],
            player2.socketId[0],
            game.uuid
        );
        await this.countDown(player1.socketId[0], player2.socketId[0]);
        this.gameGateway.updateFrontMenu(
            player1.socketId[0],
            player2.socketId[0],
            "Game"
        );
        await this.play(player1.socketId[0], player2.socketId[0], game.uuid);
    }
}
