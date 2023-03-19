import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from "src/users/services/users.service";
import { GameEntity } from "../entities/game.entity";
import { InvitationDto, InvitationResponseDto } from "../dtos/GameUtility.dto";
import { GameGateway } from "../../sockets/gateways/game.gateway";
import { UserEntity } from "src/users/entity/user.entity";
import { Vector } from "vecti";

export interface GameInterface {
    player1Username: string;
    player2Username: string;
    player1Socket: string;
    player2Socket: string;
    player1Position: number;
    player2Position: number;
    ballPosition: Vector;
    ballDirection: Vector;
    ballSpeed: number;
    player1Score: number;
    player2Score: number;
    screenHeigth: number;
    screenWidth: number;
    paddleHeigth: number;
    paddleWidth: number;
    paddleOffset: number;
    ballWidth: number;
    ballHeigth: number;
    disconnection: boolean;
}

export let games = new Map<string, GameInterface>();

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(GameEntity)
        private gameRepository: Repository<GameEntity>,
        private userService: UsersService,
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
                    throw new UnauthorizedException(
                        "You cannot start two games at the same time, your previous game has been cancelled."
                    );
                }
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
            await this.gameGateway.updateCountDown(
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

    /*

    y
    ________________________
    |                       |
    |                       |
    | |                     |
    | |       o           | |
    |                     | |
    |                       |
    |_______________________|  x

    x >= 1600 - (offset - paddlewidth - 1/2ballwidth) 
    */

    // y >= paddlepos -
    // offset + paddleWidth + 1/2 ballWidth = 68
    // x >= 1600 - offset - paddlewidth - 1/2 ballwidth
    async hitPaddle(
        paddle: number,
        match: GameInterface,
        paddlePosition: number
    ): Promise<boolean> {
        // [x] face avant paddles
        if (
            match.ballPosition.y >= paddlePosition - match.paddleHeigth / 2 &&
            match.ballPosition.y <= paddlePosition + match.paddleHeigth / 2
        ) {
            if (
                paddle === 1 &&
                match.ballPosition.x <= match.paddleOffset + match.paddleWidth
            ) {
                return true;
            } else if (
                paddle === 2 &&
                match.ballPosition.x >=
                    match.screenWidth - match.paddleOffset - match.paddleWidth
            ) {
                return true;
            }
        }
        // [ ] coins paddles
        else {
            // distance coin / centre balle <= rayon balle
            if (paddle === 1) {
                let left_bottom_corner = new Vector(
                    0 + match.paddleOffset + match.paddleWidth,
                    0 + match.player1Position - match.paddleHeigth / 2
                );
                let distance = left_bottom_corner
                    .subtract(match.ballPosition)
                    .length();
                if (distance <= match.ballHeigth / 2) {
                    return true;
                }
                let left_top_corner = new Vector(
                    0 + match.paddleOffset + match.paddleWidth,
                    0 + match.player1Position - match.paddleHeigth / 2
                );
                distance = left_top_corner
                    .subtract(match.ballPosition)
                    .length();
                if (distance <= match.ballHeigth / 2) {
                    return true;
                }
            } else if (paddle === 2) {
                let right_bottom_corner = new Vector(
                    match.screenWidth -
                        (match.paddleOffset + match.paddleWidth),
                    0 + match.player2Position - match.paddleHeigth / 2
                );
                let distance = right_bottom_corner
                    .subtract(match.ballPosition)
                    .length();
                if (distance <= match.ballHeigth / 2) {
                    return true;
                }
                let right_top_corner = new Vector(
                    match.screenWidth -
                        (match.paddleOffset + match.paddleWidth),
                    0 + match.player2Position - match.paddleHeigth / 2
                );
                distance = right_top_corner
                    .subtract(match.ballPosition)
                    .length();
                if (distance <= match.ballHeigth / 2) {
                    return true;
                }
            }
        }
        // [ ] faces inferieures / superieures
        return false;
    }

    async computeBallDirection(match: GameInterface) {
        if (
            (await this.hitPaddle(1, match, match.player1Position)) ||
            (await this.hitPaddle(2, match, match.player2Position))
        ) {
            //match.ballDirection = new Vector(0, 0);
            match.ballDirection = new Vector(
                -match.ballDirection.x,
                match.ballDirection.y
            );
        } else if (match.ballPosition.y >= match.screenHeigth) {
            match.ballDirection = new Vector(
                match.ballDirection.x,
                -match.ballDirection.y
            );
        } else if (match.ballPosition.y <= 0) {
            match.ballDirection = new Vector(
                match.ballDirection.x,
                -match.ballDirection.y
            );
        }
        return match;
    }

    async moveBall(match: GameInterface): Promise<GameInterface> {
        for (let i = 0; i < match.ballSpeed; i++) {
            match.ballPosition = match.ballPosition.add(match.ballDirection);
            if (
                (await this.hitPaddle(1, match, match.player1Position)) ||
                (await this.hitPaddle(2, match, match.player2Position)) ||
                match.ballPosition.x >= match.screenWidth ||
                match.ballPosition.x <= 0 ||
                match.ballPosition.y >= match.screenHeigth ||
                match.ballPosition.y <= 0
            ) {
                if (match.ballPosition.x <= 0) {
                    match.player2Score++;
                } else if (match.ballPosition.x >= match.screenWidth) {
                    match.player1Score++;
                } else {
                    match.ballDirection = new Vector(
                        -match.ballDirection.x,
                        match.ballDirection.y
                    );
                    match.ballPosition = match.ballPosition.add(
                        match.ballDirection
                    );
                }
                break;
            }
        }
        return match;
    }

    async startBallDir(match: GameInterface): Promise<GameInterface> {
        // engagement position
        match.ballPosition = new Vector(
            match.screenWidth / 2,
            match.screenHeigth / 2
        );
        // engagement direction
        if (Math.round(Math.random()) % 2 === 1) {
            match.ballDirection = new Vector(1, 0);
        } else {
            match.ballDirection = new Vector(-1, 0);
        }
        // engagement angle
        const random = Math.floor(Math.random() * 91 - 45);
        match.ballDirection = match.ballDirection.rotateByDegrees(random);
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
                match.player1Socket,
                match.player2Socket,
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
        let scorePlayer1 = match.player1Score;
        let scorePlayer2 = match.player1Score;
        match = await this.startBallDir(match);
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
        let match = {
            player1Username: player1.username,
            player2Username: player2.username,
            player1Socket: player1.socketId[0],
            player2Socket: player2.socketId[0],
            player1Score: 0,
            player2Score: 0,
            player1Position: 450,
            player2Position: 450,
            ballPosition: new Vector(800, 450),
            ballDirection: new Vector(1, 0),
            ballSpeed: 10,
            screenHeigth: 900,
            screenWidth: 1600,
            paddleHeigth: 90,
            paddleWidth: 32,
            paddleOffset: 16,
            ballWidth: 40, // 2.5 % screenWidth
            ballHeigth: 22.5, // 2.5% screenHeigth
            disconnection: false,
        };
        games.set(game.uuid, match);
        await this.gameGateway.sendGameID(
            player1.socketId[0],
            player2.socketId[0],
            game.uuid
        );
        await this.gameGateway.sendPos(
            player1.socketId[0],
            player1.socketId[0],
            match
        );
        await this.countDown(player1.socketId[0], player2.socketId[0]);
        this.gameGateway.updateFrontMenu(
            player1.socketId[0],
            player2.socketId[0],
            "Game"
        );
        let gameResults = await this.game(
            player1.socketId[0],
            player2.socketId[0],
            game.uuid
        );
        // save game results
        if (gameResults) {
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

// - [ ] Gestion collision paddle dans les coins et faces inf/sup
// - [ ] Matchmaking a regler
// - [ ] Sauvegarder resultats match
