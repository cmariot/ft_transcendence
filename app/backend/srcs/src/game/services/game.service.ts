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
    player1ID: string;
    player1Score: number;
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

    @SubscribeMessage("down")
    async moveDown(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { gameID: string }
    ) {
        let gamePos = this.pos.get(data.gameID);
        if (gamePos) {
            if (client.id === gamePos.player1ID) {
                if (gamePos.player1 > 0) {
                    gamePos.player1 = gamePos.player1 - 45;
                }
            } else if (client.id === gamePos.player2ID) {
                if (gamePos.player2 > 0) {
                    gamePos.player2 = gamePos.player2 - 45;
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
                if (gamePos.player1 < 900) {
                    gamePos.player1 = gamePos.player1 + 45;
                }
            } else if (client.id === gamePos.player2ID) {
                if (gamePos.player2 < 900) {
                    gamePos.player2 = gamePos.player2 + 45;
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
    //
    async hitPaddleRight(pos: PositionInterface): Promise<PositionInterface> {
        if (
            pos.ball.x + pos.ballRadius ===
            pos.screenWidth - pos.paddleOffset - pos.paddleWidth
        ) {
            let hit = Math.abs(pos.ball.y - pos.player2);
            if (hit <= pos.paddleHeigth / 2) {
                let percent = pos.paddleHeigth - hit / (pos.paddleHeigth * 100);
                pos.direction = new Vector(
                    -pos.direction.x,
                    -pos.direction.y * percent
                );
            }
        }
        return pos;
    }

    async hitPaddleLeft(pos: PositionInterface): Promise<PositionInterface> {
        if (
            pos.ball.x - pos.ballRadius ===
            0 + pos.paddleOffset + pos.paddleWidth
        ) {
            let hit = Math.abs(pos.ball.y - pos.player1);
            if (hit <= pos.paddleHeigth / 2) {
                let percent = pos.paddleHeigth - hit / (pos.paddleHeigth * 100);
                pos.direction = new Vector(
                    -pos.direction.x,
                    -pos.direction.y * percent
                );
            }
        }
        return pos;
    }

    async collision(pos: PositionInterface) {
        //colision paddle left
        pos = await this.hitPaddleRight(pos);
        //collision paddle right
        pos = await this.hitPaddleLeft(pos);
        //collision top
        if (pos.ball.x >= 1600 || pos.ball.x <= 0) {
            pos.direction = new Vector(-pos.direction.x, pos.direction.y);
        }
        if (pos.ball.y >= pos.screenHeigth - pos.ballRadius) {
            pos.direction = new Vector(pos.direction.x, -pos.direction.y);
        }
        //collision bottom
        if (pos.ball.y <= 0 + pos.ballRadius) {
            pos.direction = new Vector(pos.direction.x, -pos.direction.y);
        }
        return pos;
    }

    async ballmvt(pos: PositionInterface): Promise<PositionInterface> {
        pos = await this.collision(pos);
        let newVector = pos.direction.multiply(10);
        pos.ball = pos.ball.add(newVector);
        return pos;
    }

    async startBallDir(pos: PositionInterface): Promise<PositionInterface> {
        let random = Math.floor(Math.random() * (360 - 0 + 1)) + 0;
        pos.direction = pos.direction.rotateByDegrees(random);
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

    convert(pos: PositionInterface): PositionInterface {
        return {
            player1: pos.player1,
            player2: pos.player2,
            ball: new Vector(pos.ball.x / 16, pos.ball.y / 9),
            direction: pos.direction,
            speed: pos.speed,
            player1ID: pos.player1ID,
            player1Score: pos.player1Score,
            player2ID: pos.player2ID,
            player2Score: pos.player1Score,
            screenHeigth: pos.screenHeigth,
            screenWidth: pos.screenWidth,
            paddleHeigth: pos.paddleHeigth,
            paddleWidth: pos.paddleWidth,
            paddleOffset: pos.paddleOffset,
            ballRadius: pos.ballRadius,
        };
    }

    async game(player1Socket: string, player2Socket: string, gameID: string) {
        let pos = this.pos.get(gameID);
        if (!pos) {
            return;
        }
        pos = await this.startBallDir(pos);
        const scorePlayer1 = pos.player1Score;
        const scorePlayer2 = pos.player1Score;
        while (true) {
            pos = await this.ballmvt(pos);
            const converted = await this.convert(pos);
            await this.gameGateway.sendPos(
                player1Socket,
                player2Socket,
                converted
            );
            if (this.someoneGoal(pos, scorePlayer1, scorePlayer2)) {
                pos = await this.startBallDir(pos);
                if (pos.player1Score >= 15 && pos.player2Score >= 15) {
                    this.timeout(1000);
                    break;
                } else {
                    this.timeout(2000);
                }
            }
            await this.timeout(16);
        }
        return pos;
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
            speed: 4,
            player1ID: player1.socketId[0],
            player1Score: 0,
            player2ID: player2.socketId[0],
            player2Score: 0,
            screenHeigth: 900,
            screenWidth: 1600,
            paddleHeigth: 90,
            paddleWidth: 18,
            paddleOffset: 9,
            ballRadius: 32,
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
