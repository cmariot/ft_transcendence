import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from "src/users/services/users.service";
import { GameEntity } from "../entities/game.entity";
import { GameGateway } from "../../sockets/gateways/game.gateway";
import { Vector } from "vecti";
import { GameInterface } from "../interfaces/game.interface";
import { UserEntity } from "src/users/entity/user.entity";

export let games = new Map<string, GameInterface>();

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(GameEntity)
        private gameRepository: Repository<GameEntity>,
        private userService: UsersService,
        private gameGateway: GameGateway
    ) {}

    async sleep(ms: number) {
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
            await this.sleep(1000);
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
        // [ ] face avant paddles
        // [ ] coins paddles
        // [ ] faces inferieures / superieures
        // [ ] mouvement paddle rentre dans balle ?

        // hit the paddle front directly

        const posPaddleYPercentage =
            (paddlePosition / match.screenHeigth) * 100;
        const realPaddleYPercentage =
            posPaddleYPercentage *
            ((match.screenHeigth - match.paddleHeigth) / match.screenHeigth);
        const paddleY =
            match.paddleHeigth / 2 +
            (match.screenHeigth / 100) * realPaddleYPercentage;

        const posBallYPercentage =
            (match.ballPosition.y / match.screenHeigth) * 100;
        const realBallYPercentage =
            posBallYPercentage *
            ((match.screenHeigth - match.ballHeigth) / match.screenHeigth);
        const ballY =
            match.ballHeigth / 2 +
            (match.screenHeigth / 100) * realBallYPercentage;

        const posBallXPercentage =
            (match.ballPosition.x / match.screenWidth) * 100;
        const realBallXPercentage =
            posBallXPercentage *
            ((match.screenWidth - match.ballWidth) / match.screenWidth);
        const ballX =
            match.ballWidth / 2 +
            (match.screenWidth / 100) * realBallXPercentage;

        const paddle1X = 0 + match.paddleOffset + match.paddleWidth;
        const paddle2X =
            match.screenWidth - match.paddleOffset - match.paddleWidth;

        if (
            ballY <= paddleY + match.paddleHeigth / 2 &&
            ballY >= paddleY - match.paddleHeigth / 2
        ) {
            if (paddle === 1 && ballX <= paddle1X + match.ballWidth * 0.5) {
                return true;
            } else if (
                paddle === 2 &&
                ballX >= paddle2X - match.ballWidth * 0.5
            ) {
                return true;
            }
        }
        if (
            ballY <= paddleY + match.paddleHeigth / 2 + match.ballHeigth / 2 &&
            ballY >= paddleY - match.paddleHeigth / 2 - match.ballHeigth / 2
        ) {
            let ball = new Vector(ballX, ballY);
            if (paddle === 1) {
                let edge_top = new Vector(
                    paddle1X,
                    paddleY + match.paddleHeigth / 2
                );
                if (ball.subtract(edge_top).length() <= match.ballWidth / 2)
                    return true;
                let edge_bottom = new Vector(
                    paddle1X,
                    paddleY - match.paddleHeigth / 2
                );
                if (ball.subtract(edge_bottom).length() <= match.ballWidth / 2)
                    return true;
            } else if (paddle === 2) {
                let edge_top = new Vector(
                    paddle2X,
                    paddleY + match.paddleHeigth / 2
                );
                if (ball.subtract(edge_top).length() <= match.ballWidth / 2)
                    return true;
                let edge_bottom = new Vector(
                    paddle2X,
                    paddleY - match.paddleHeigth / 2
                );
                if (ball.subtract(edge_bottom).length() <= match.ballWidth / 2)
                    return true;
            }
        }
        return false;
    }

    async computeBallDirection(match: GameInterface) {
        if (match.ballPosition.y <= 0) {
            match.ballDirection = new Vector(
                match.ballDirection.x,
                -match.ballDirection.y
            );
        } else if (match.ballPosition.y >= match.screenHeigth) {
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
                (await this.hitPaddle(2, match, match.player2Position))
            ) {
                match.ballDirection = new Vector(
                    -match.ballDirection.x,
                    match.ballDirection.y
                );
                while (
                    (await this.hitPaddle(1, match, match.player1Position)) ||
                    (await this.hitPaddle(2, match, match.player2Position))
                ) {
                    match.ballPosition = match.ballPosition.add(
                        match.ballDirection
                    );
                    if (
                        match.ballPosition.x >= match.screenWidth ||
                        match.ballPosition.x <= 0 ||
                        match.ballPosition.y >= match.screenHeigth ||
                        match.ballPosition.y <= 0
                    ) {
                        if (match.ballPosition.x <= 0) {
                            match.player2Score++;
                        } else if (match.ballPosition.x >= match.screenWidth) {
                            match.player1Score++;
                        }
                        break;
                    }
                }
                break;
            } else if (
                match.ballPosition.x >= match.screenWidth ||
                match.ballPosition.x <= 0 ||
                match.ballPosition.y >= match.screenHeigth ||
                match.ballPosition.y <= 0
            ) {
                if (match.ballPosition.x <= 0) {
                    match.player2Score++;
                } else if (match.ballPosition.x >= match.screenWidth) {
                    match.player1Score++;
                }
                break;
            }
        }
        return match;
    }

    // engagement position
    // engagement direction
    // engagement angle
    async startBallDir(match: GameInterface): Promise<GameInterface> {
        match.ballPosition = new Vector(
            match.screenWidth / 2,
            match.screenHeigth / 2
        );
        if (Math.round(Math.random()) % 2 === 1) {
            match.ballDirection = new Vector(1, 0);
        } else {
            match.ballDirection = new Vector(-1, 0);
        }
        const random = Math.floor(Math.random() * 91 - 45);
        match.ballDirection = match.ballDirection.rotateByDegrees(random);
        return match;
    }

    // Return true if the score changes
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

    // Return true if someone disconnects during the game
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

    // Game loop
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
                    await this.sleep(1000);
                }
            }
            if (this.someoneDisconnect(gameID)) {
                return false;
            }
            await this.sleep(16);
        }
        return true;
    }

    // Set the defaults settings for the game
    createGame(player1: UserEntity, player2: UserEntity): GameInterface {
        const screenHeigth = 500;
        const screenWidth = 500;
        const paddleHeigth = 10;
        const ballSize = 2.5;

        let match: GameInterface = {
            player1Username: player1.username,
            player2Username: player2.username,
            player1Socket: player1.socketId[0],
            player2Socket: player2.socketId[0],
            player1Score: 0,
            player2Score: 0,
            player1Position: screenHeigth / 2,
            player2Position: screenHeigth / 2,
            ballPosition: new Vector(screenWidth / 2, screenHeigth / 2),
            ballDirection: new Vector(1, 0),
            ballSpeed: 3,
            screenHeigth: screenHeigth,
            screenWidth: screenWidth,
            paddleHeigth: (screenHeigth / 100) * paddleHeigth,
            paddleWidth: (screenWidth / 100) * 2,
            paddleOffset: (screenWidth / 100) * 1,
            ballWidth: (screenWidth / 100) * ballSize,
            ballHeigth: (screenHeigth / 100) * ballSize,
            disconnection: false,
        };
        return match;
    }

    // Send info to the frontend via socket and start a game
    async startGame(game: GameEntity) {
        const player1 = await this.userService.getByID(game.hostID);
        const player2 = await this.userService.getByID(game.guestID);
        if (!player1 || !player2) {
            throw new UnauthorizedException("User not found");
        } else if (
            player1.socketId.length === 0 ||
            player2.socketId.length === 0
        ) {
            throw new UnauthorizedException("Invalid user sockets");
        }
        await this.userService.setStatusByID(player1.uuid, "ingame");
        await this.userService.setStatusByID(player2.uuid, "ingame");
        let match = this.createGame(player1, player2);
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
        if (gameResults) {
            // save game results
            await this.userService.saveGameResult(
                player1.uuid,
                player2.uuid,
                match.player1Score,
                match.player2Score
            );
            this.gameGateway.updateFrontMenu(
                player1.socketId[0],
                player2.socketId[0],
                "Results"
            );
            await this.userService.setStatusByID(game.hostID, "online");
            await this.userService.setStatusByID(game.guestID, "online");
        } else {
            await this.userService.setStatusIfNotOffline(game.hostID, "online");
            await this.userService.setStatusIfNotOffline(
                game.guestID,
                "online"
            );
        }
        await this.gameRepository.remove(game);
        games.delete(game.uuid);
    }
}

// - [ ] Gestion collision paddle sur les faces inf/sup
// - [ ] Mouvement paddles, gerer mouvement dans la balle
// - [ ] Invitation a tester
