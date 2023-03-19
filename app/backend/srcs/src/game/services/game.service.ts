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

export interface GameInterface {
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
    disconnection: boolean;
}

export let games = new Map<string, GameInterface>();

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
            if (game) {
                if (game.status === "waiting") {
                    throw new UnauthorizedException("Already in queue.");
                } else if (game.status === "playing") {
                    throw new UnauthorizedException(
                        "You cannot start two games at the same time."
                    );
                }
            }
        }
        await this.userService.setStatusByID(uuid, "matchmaking");
        game = await this.gameRepository.findOneBy({
            status: "waiting",
        });
        if (!game) {
            game = new GameEntity();
            game.hostID = uuid;
            game.guestID = "";
            game.status = "waiting";
            await this.gameRepository.save(game);
        } else {
            game.guestID = uuid;
            game.status = "playing";
            await this.gameRepository.save(game);
            this.startGame(game);
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

    async invitation(users: InvitationDto) {
        //    let host: UserEntity = await this.userService.getByUsername(users.host);
        //    let guest: UserEntity = await this.userService.getByUsername(
        //        users.guest
        //    );
        //    if (!host) {
        //        throw new HttpException(
        //            "Host do not exist",
        //            HttpStatus.BAD_REQUEST
        //        );
        //    }
        //    if (!guest) {
        //        throw new HttpException(
        //            "Guest do not exist",
        //            HttpStatus.BAD_REQUEST
        //        );
        //    }
        //    let game: GameEntity;
        //    game.hostID = host.uuid;
        //    await this.gameRepository.save(game);
        //    await this.userService.setStatusByID(game.hostID, "matchmaking");
        //    await this.gameGateway.sendInvitation(guest.socketId[0], host.uuid);
        //    return "Invitation pending";
    }

    async ResponseInvitation(users: InvitationResponseDto) {
        //    if (!users.response) {
        //        let host: UserEntity = await this.userService.getByID(users.hostID);
        //        return await this.cancelQueue(host.username);
        //    }
        //    let game: GameEntity = await this.gameRepository.findOneBy({
        //        hostID: users.hostID,
        //    });
        //    if (!game) {
        //        throw new HttpException(
        //            "Host Game do not exist",
        //            HttpStatus.NOT_FOUND
        //        );
        //    }
        //    let guest: UserEntity = await this.userService.getByUsername(
        //        users.guest
        //    );
        //    game.guestID = guest.uuid;
        //    await this.userService.setStatusByID(game.hostID, "matchmaking");
        //    await this.gameRepository.save(game);
        //    this.startGame(game);
        //    return "Game accepted";
    }

    async userDisconnection(user: UserEntity, recursive: boolean) {
        let game: GameEntity;
        if (recursive === true) {
            game = await this.gameRepository.findOneBy({
                hostID: user.uuid,
            });
        } else {
            game = await this.gameRepository.findOneBy({
                guestID: user.uuid,
            });
        }
        if (game) {
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
    async hitPaddleRight(match: GameInterface): Promise<boolean> {
        if (
            match.ball.y >= match.player2 - match.paddleHeigth / 2 &&
            match.ball.y <= match.player2 + match.paddleHeigth / 2
        ) {
            if (
                match.ball.x >=
                match.screenWidth -
                    (match.paddleOffset +
                        match.paddleWidth * 0.5 +
                        match.ballRadius)
            ) {
                return true;
            }
        }

        return false;
    }

    async hitPaddleLeft(match: GameInterface): Promise<boolean> {
        if (
            match.ball.y >= match.player1 - match.paddleHeigth / 2 &&
            match.ball.y <= match.player1 + match.paddleHeigth / 2
        ) {
            if (
                match.ball.x <=
                0 +
                    match.paddleOffset +
                    match.paddleWidth * 0.5 +
                    match.ballRadius
            ) {
                return true;
            }
        }
        return false;
    }

    async computeBallDirection(match: GameInterface) {
        if (
            (await this.hitPaddleRight(match)) ||
            (await this.hitPaddleLeft(match))
        ) {
            match.direction = new Vector(-match.direction.x, match.direction.y);
        } else if (match.ball.y >= match.screenHeigth) {
            match.direction = new Vector(match.direction.x, -match.direction.y);
        } else if (match.ball.y <= 0) {
            match.direction = new Vector(match.direction.x, -match.direction.y);
        }
        return match;
    }

    async moveBall(match: GameInterface): Promise<GameInterface> {
        for (let i = 0; i < match.speed; i++) {
            match.ball = match.ball.add(match.direction);
            if (
                (await this.hitPaddleRight(match)) ||
                (await this.hitPaddleLeft(match)) ||
                match.ball.x >= match.screenWidth ||
                match.ball.x <= 0 ||
                match.ball.y >= match.screenHeigth ||
                match.ball.y <= 0
            ) {
                if (match.ball.x <= 0) {
                    match.player2Score++;
                } else if (match.ball.x >= match.screenWidth) {
                    match.player1Score++;
                }
                break;
            }
        }
        return match;
    }

    async startBallDir(match: GameInterface): Promise<GameInterface> {
        const random = Math.floor(Math.random() * (0 - 360 + 1)) + 0;
        match.direction = match.direction.rotateByDegrees(random);
        match.ball = new Vector(match.screenWidth / 2, match.screenHeigth / 2);
        return match;
    }

    someoneGoal(
        match: GameInterface,
        previousScorePlayer1: number,
        previousScorePlayer2: number
    ): boolean {
        return (
            match.player1Score !== previousScorePlayer1 ||
            match.player2Score !== previousScorePlayer2
        );
    }

    someoneDisconnect(gameID: string) {
        let match = games.get(gameID);
        if (!match) {
            return true;
        }
        if (match.disconnection) {
            this.gameGateway.updateFrontMenu(
                match.player1ID,
                match.player2ID,
                "Disconnection"
            );
        }
        return match.disconnection;
    }

    async game(player1Socket: string, player2Socket: string, gameID: string) {
        let match = games.get(gameID);
        if (!match) {
            return;
        }
        match = await this.startBallDir(match);
        let scorePlayer1 = match.player1Score;
        let scorePlayer2 = match.player1Score;
        while (true) {
            match = await this.computeBallDirection(match);
            match = await this.moveBall(match);
            await this.gameGateway.sendPos(player1Socket, player2Socket, match);
            if (this.someoneGoal(match, scorePlayer1, scorePlayer2)) {
                if (match.player1Score >= 15 || match.player2Score >= 15) {
                    break;
                } else {
                    scorePlayer1 = match.player1Score;
                    scorePlayer2 = match.player2Score;
                    match = await this.startBallDir(match);
                    await this.timeout(1000);
                }
            }
            if (this.someoneDisconnect(gameID)) {
                return false;
            }
            await this.timeout(16);
        }
        return true;
    }

    async startGame(game: GameEntity) {
        const player1 = await this.userService.getByID(game.hostID);
        const player2 = await this.userService.getByID(game.guestID);
        if (!player1 || !player2) {
            throw new UnauthorizedException("User not found");
        }
        await this.userService.setStatusByID(player1.uuid, "ingame");
        await this.userService.setStatusByID(player2.uuid, "ingame");
        games.set(game.uuid, {
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
            disconnection: false,
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
        let hasAWinner = await this.game(
            player1.socketId[0],
            player2.socketId[0],
            game.uuid
        );
        // save game results
        if (hasAWinner) {
            this.gameGateway.updateFrontMenu(
                player1.socketId[0],
                player2.socketId[0],
                "Results"
            );
        }
        await this.userService.setStatusByID(game.hostID, "online");
        await this.userService.setStatusByID(game.guestID, "online");
        await this.gameRepository.remove(game);
        games.delete(game.uuid);
    }
}

// - [ ] Matchmaking a regler
// - [ ] Gestion collision paddle
// - [ ] Affichage de la balle en %age dans le front avec ballHeigth / ballWidth ?
