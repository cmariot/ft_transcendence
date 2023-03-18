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
import { Vector } from "vecti";

export interface PositionInterface {
    player1: number;
    player2: number;
    ball: Vector;
    direction: Vector;
    speed: number;
    player1Username: string;
    player1ID: string;
    player1Score: number;
    player2Username: string;
    player2ID: string;
    player2Score: number;
    screenHeigth: number;
    screenWidth: number;
    paddleHeigth: number;
    paddleWidth: number;
    paddleOffset: number;
    ballRadius: number;
}

@Injectable()
@WebSocketGateway(3001, { cors: { origin: "https://localhost:8443" } })
export class GameService {
    constructor(
        @InjectRepository(GameEntity)
        private gameRepository: Repository<GameEntity>,
        private userService: UsersService,
        private gameGateway: GameGateway
    ) {}

    private pos = new Map<string, PositionInterface>();

    @WebSocketServer()
    server: Server;

    async joinQueue(username: string) {
        let player: UserEntity = await this.userService.getByUsername(username);
        if (!player) {
            throw new UnauthorizedException("User not found");
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
            if (!game) {
                throw new HttpException(
                    "Not in Queue",
                    HttpStatus.UNAUTHORIZED
                );
            }
        }
        if (game.hostID) {
            player = await this.userService.getByID(game.hostID);
            await this.userService.setStatusByID(game.hostID, "online");
            await this.gameGateway.sendCancel(
                player.socketId[0],
                "queueCancel"
            );
        }
        //else if ?
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

    @SubscribeMessage("down")
    async moveDown(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { gameID: string }
    ) {
        let gamePos = this.pos.get(data.gameID);
        if (gamePos) {
            if (client.id === gamePos.player1ID) {
                if (gamePos.player1 > 0) {
                    gamePos.player1 -= gamePos.screenHeigth / 10;
                }
            } else if (client.id === gamePos.player2ID) {
                if (gamePos.player2 > 0) {
                    gamePos.player2 -= gamePos.screenHeigth / 10;
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
                if (gamePos.player1 < gamePos.screenHeigth) {
                    gamePos.player1 += gamePos.screenHeigth / 10;
                }
            } else if (client.id === gamePos.player2ID) {
                if (gamePos.player2 < gamePos.screenHeigth) {
                    gamePos.player2 += gamePos.screenHeigth / 10;
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

    // Screen dimension : 1600 * 900
    // 18 * 90 Paddle
    // 32
    async hitPaddleRight(pos: PositionInterface): Promise<boolean> {
        if (
            pos.ball.y >= pos.player2 - pos.paddleHeigth / 2 &&
            pos.ball.y <= pos.player2 + pos.paddleHeigth / 2
        ) {
            if (
                pos.ball.x >=
                pos.screenWidth -
                    (pos.paddleOffset + pos.paddleWidth * 0.5 + pos.ballRadius)
            ) {
                return true;
            }
        }

        return false;
    }

    async hitPaddleLeft(pos: PositionInterface): Promise<boolean> {
        if (
            pos.ball.y >= pos.player1 - pos.paddleHeigth / 2 &&
            pos.ball.y <= pos.player1 + pos.paddleHeigth / 2
        ) {
            if (
                pos.ball.x <=
                0 + pos.paddleOffset + pos.paddleWidth * 0.5 + pos.ballRadius
            ) {
                return true;
            }
        }
        return false;
    }

    async computeBallDirection(pos: PositionInterface) {
        if (
            (await this.hitPaddleRight(pos)) ||
            (await this.hitPaddleLeft(pos))
        ) {
            pos.direction = new Vector(-pos.direction.x, pos.direction.y);
            // pos.direction = new Vector(0, 0); //arreter la balle quand ca touche
        } else if (pos.ball.y >= pos.screenHeigth) {
            pos.direction = new Vector(pos.direction.x, -pos.direction.y);
        } else if (pos.ball.y <= 0) {
            pos.direction = new Vector(pos.direction.x, -pos.direction.y);
        }
        return pos;
    }

    async moveBall(pos: PositionInterface): Promise<PositionInterface> {
        for (let i = 0; i < pos.speed; i++) {
            pos.ball = pos.ball.add(pos.direction);
            if (
                (await this.hitPaddleRight(pos)) ||
                (await this.hitPaddleLeft(pos)) ||
                pos.ball.x >= pos.screenWidth ||
                pos.ball.x <= 0 ||
                pos.ball.y >= pos.screenHeigth ||
                pos.ball.y <= 0
            ) {
                if (pos.ball.x <= 0) {
                    pos.player2Score++;
                } else if (pos.ball.x >= pos.screenWidth) {
                    pos.player1Score++;
                }
                break;
            }
        }
        return pos;
    }

    async startBallDir(pos: PositionInterface): Promise<PositionInterface> {
        const random = Math.floor(Math.random() * (0 - 360 + 1)) + 0;
        pos.direction = pos.direction.rotateByDegrees(random);
        pos.ball = new Vector(pos.screenWidth / 2, pos.screenHeigth / 2);
        return pos;
    }

    someoneGoal(
        pos: PositionInterface,
        previousScorePlayer1: number,
        previousScorePlayer2: number
    ): boolean {
        return (
            pos.player1Score !== previousScorePlayer1 ||
            pos.player2Score !== previousScorePlayer2
        );
    }

    async game(player1Socket: string, player2Socket: string, gameID: string) {
        let pos = this.pos.get(gameID);
        if (!pos) {
            return;
        }
        pos = await this.startBallDir(pos);
        let scorePlayer1 = pos.player1Score;
        let scorePlayer2 = pos.player1Score;
        while (true) {
            pos = await this.computeBallDirection(pos);
            pos = await this.moveBall(pos);
            await this.gameGateway.sendPos(player1Socket, player2Socket, pos);
            if (this.someoneGoal(pos, scorePlayer1, scorePlayer2)) {
                if (pos.player1Score >= 15 || pos.player2Score >= 15) {
                    break;
                } else {
                    scorePlayer1 = pos.player1Score;
                    scorePlayer2 = pos.player2Score;
                    pos = await this.startBallDir(pos);
                    await this.timeout(1000);
                }
            }
            await this.timeout(16);
        }
    }

    async startGame(game: GameEntity) {
        const player1 = await this.userService.getByID(game.hostID);
        const player2 = await this.userService.getByID(game.guestID);
        if (!player1 || !player2) {
            throw new UnauthorizedException("User not found");
        }
        await this.userService.setStatusByID(game.hostID, "ingame");
        await this.userService.setStatusByID(game.guestID, "ingame");
        this.pos.set(game.uuid, {
            player1: 450,
            player2: 450,
            ball: new Vector(800, 450),
            direction: new Vector(1, 0),
            speed: 10,
            player1Username: player1.username,
            player1ID: player1.socketId[0],
            player1Score: 0,
            player2Username: player2.username,
            player2ID: player2.socketId[0],
            player2Score: 0,
            screenHeigth: 900,
            screenWidth: 1600,
            paddleHeigth: 90,
            paddleWidth: 18,
            paddleOffset: 8,
            ballRadius: 9,
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
        await this.game(player1.socketId[0], player2.socketId[0], game.uuid);
        this.pos.delete(game.uuid);
    }
}

// - [ ] Matchmaking a regler
// - [ ] Gestion collision paddle
// - [ ] Affichage de la balle en %age dans le front avec ballHeigth / ballWidth ?
