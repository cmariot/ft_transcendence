import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from "src/users/services/users.service";
import { GameEntity } from "../entities/game.entity";
import { GameGateway } from "../../sockets/gateways/game.gateway";
import { Vector } from "vecti";
import { GameInterface } from "../interfaces/game.interface";
import { UserEntity } from "src/users/entity/user.entity";
import { getRandomBetween } from "./random";

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

    async countDown(game: GameInterface) {
        for (let i = 4; i !== 0; i--) {
            await this.gameGateway.updateCountDown(game, "countDown", i);
            await this.sleep(1000);
        }
    }

    getPaddleY(paddlePosition: number, match: GameInterface): number {
        const posPaddleYPercentage =
            (paddlePosition / match.screenHeigth) * 100;
        const realPaddleYPercentage =
            posPaddleYPercentage *
            ((match.screenHeigth - match.paddleHeigth) / match.screenHeigth);
        return (
            match.paddleHeigth / 2 +
            (match.screenHeigth / 100) * realPaddleYPercentage
        );
    }

    getBallY(match: GameInterface): number {
        const posBallYPercentage =
            (match.ballPosition.y / match.screenHeigth) * 100;
        const realBallYPercentage =
            posBallYPercentage *
            ((match.screenHeigth - match.ballHeigth) / match.screenHeigth);
        return (
            match.ballHeigth / 2 +
            (match.screenHeigth / 100) * realBallYPercentage
        );
    }

    getBallX(match: GameInterface): number {
        const posBallXPercentage =
            (match.ballPosition.x / match.screenWidth) * 100;
        const realBallXPercentage =
            posBallXPercentage *
            ((match.screenWidth - match.ballWidth) / match.screenWidth);
        return (
            match.ballWidth / 2 +
            (match.screenWidth / 100) * realBallXPercentage
        );
    }

    async hitPaddleFront(
        paddle: number,
        match: GameInterface,
        paddlePosition: number
    ): Promise<{ hit: boolean; angle: Vector | null }> {
        if (
            match.ballPosition.x >= match.screenWidth ||
            match.ballPosition.x <= 0 ||
            match.ballPosition.y >= match.screenHeigth ||
            match.ballPosition.y <= 0
        ) {
            return { hit: false, angle: null };
        }
        const paddleY = this.getPaddleY(paddlePosition, match);
        const ballY = this.getBallY(match);
        const ballX = this.getBallX(match);
        const paddle1X = 0 + match.paddleOffset + match.paddleWidth;
        const paddle2X =
            match.screenWidth - match.paddleOffset - match.paddleWidth;
        if (
            ballY <= paddleY + match.paddleHeigth / 2 &&
            ballY >= paddleY - match.paddleHeigth / 2
        ) {
            if (paddle === 1 && ballX <= paddle1X + match.ballWidth * 0.5) {
                {
                    let angle = new Vector(
                        -match.ballDirection.x,
                        match.ballDirection.y + (ballY - paddleY) / paddleY
                    );
                    return { hit: true, angle: angle };
                }
            } else if (
                paddle === 2 &&
                ballX >= paddle2X - match.ballWidth * 0.5
            ) {
                let angle = new Vector(
                    -match.ballDirection.x,
                    match.ballDirection.y + (ballY - paddleY) / paddleY
                );
                return { hit: true, angle: angle };
            }
        }
        return { hit: false, angle: null };
    }

    async hitPaddleCorner(
        paddle: number,
        match: GameInterface,
        paddlePosition: number
    ): Promise<boolean> {
        if (
            match.ballPosition.x >= match.screenWidth ||
            match.ballPosition.x <= 0 ||
            match.ballPosition.y >= match.screenHeigth ||
            match.ballPosition.y <= 0
        ) {
            return false;
        }
        const paddleY = this.getPaddleY(paddlePosition, match);
        const ballY = this.getBallY(match);
        const ballX = this.getBallX(match);
        const paddle1X = 0 + match.paddleOffset + match.paddleWidth;
        const paddle2X =
            match.screenWidth - match.paddleOffset - match.paddleWidth;
        if (
            ballY <= paddleY + match.paddleHeigth / 2 + match.ballHeigth / 2 &&
            ballY >= paddleY - match.paddleHeigth / 2 - match.ballHeigth / 2
        ) {
            if (paddle === 1) {
                let xa = paddle1X;
                let ya = paddleY + match.paddleHeigth / 2;
                let xb = ballX;
                let yb = ballY;
                let ab = Math.sqrt(Math.pow(xb - xa, 2) + Math.pow(yb - ya, 2));
                if (ab <= match.ballHeigth / 2) {
                    return true;
                }
                ya = paddleY - match.paddleHeigth / 2;
                ab = Math.sqrt(Math.pow(xb - xa, 2) + Math.pow(yb - ya, 2));
                if (ab <= match.ballHeigth / 2) {
                    return true;
                }
            } else if (paddle === 2) {
                let xa = paddle2X;
                let ya = paddleY + match.paddleHeigth / 2;
                let xb = ballX;
                let yb = ballY;
                let ab = Math.sqrt(Math.pow(xb - xa, 2) + Math.pow(yb - ya, 2));
                if (ab <= match.ballHeigth / 2) {
                    return true;
                }
                ya = paddleY - match.paddleHeigth / 2;
                ab = Math.sqrt(Math.pow(xb - xa, 2) + Math.pow(yb - ya, 2));
                if (ab <= match.ballHeigth / 2) {
                    return true;
                }
            }
        }
        return false;
    }

    async hitHorizontal(
        paddle: number,
        match: GameInterface,
        paddlePosition: number
    ): Promise<boolean> {
        const ballY = this.getBallY(match);
        const ballX = this.getBallX(match);

        var hit: boolean;
        if (paddle === 1) {
            const paddle1X = 0 + match.paddleOffset + match.paddleWidth;
            hit = ballX < paddle1X;
        } else if (paddle === 2) {
            const paddle2X =
                match.screenWidth - match.paddleOffset - match.paddleWidth;
            hit = ballX > paddle2X;
        }
        const paddleY = this.getPaddleY(paddlePosition, match);

        if (
            hit &&
            ballY <= paddleY + match.paddleHeigth / 2 + match.ballHeigth / 2 &&
            ballY >= paddleY - match.paddleHeigth / 2 - match.ballHeigth / 2
        ) {
            return true;
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
                return match;
            }
            if (match.lose === false) {
                let response = await this.hitPaddleFront(
                    1,
                    match,
                    match.player1Position
                );
                if (response.hit === false)
                    response = await this.hitPaddleFront(
                        2,
                        match,
                        match.player2Position
                    );
                if (response.hit === true) {
                    match.ballDirection = response.angle;
                    while (
                        (
                            await this.hitPaddleFront(
                                1,
                                match,
                                match.player1Position
                            )
                        ).hit === true ||
                        (
                            await this.hitPaddleFront(
                                2,
                                match,
                                match.player2Position
                            )
                        ).hit === true
                    ) {
                        match.ballPosition = match.ballPosition.add(
                            match.ballDirection
                        );
                    }
                    break;
                } else if (
                    (await this.hitPaddleCorner(
                        1,
                        match,
                        match.player1Position
                    )) ||
                    (await this.hitPaddleCorner(
                        2,
                        match,
                        match.player2Position
                    ))
                ) {
                    match.ballDirection = new Vector(
                        -match.ballDirection.x,
                        match.ballDirection.y
                    );
                    while (
                        (await this.hitPaddleCorner(
                            1,
                            match,
                            match.player1Position
                        )) ||
                        (await this.hitPaddleCorner(
                            2,
                            match,
                            match.player2Position
                        ))
                    ) {
                        match.ballPosition = match.ballPosition.add(
                            match.ballDirection
                        );
                    }
                    break;
                } else if (
                    (await this.hitHorizontal(
                        1,
                        match,
                        match.player1Position
                    )) ||
                    (await this.hitHorizontal(2, match, match.player2Position))
                ) {
                    if (match.lose === false) {
                        match.ballDirection = new Vector(
                            match.ballDirection.x,
                            -match.ballDirection.y
                        );
                        match.lose = true;
                    }
                }
            }
        }
        return match;
    }

    // engagement position
    // engagement direction
    // engagement angle
    async startBallDir(match: GameInterface): Promise<GameInterface> {
        match.lose = false;
        match.ballPosition = new Vector(
            match.screenWidth / 2,
            match.screenHeigth / 2
        );
        if (getRandomBetween(0, 1) === 1) {
            match.ballDirection = new Vector(1, 0);
        } else {
            match.ballDirection = new Vector(-1, 0);
        }
        const random = getRandomBetween(-45, 45);
        if (random === 0) {
            if (getRandomBetween(0, 1) === 0) {
                match.ballDirection = match.ballDirection.rotateByDegrees(-20);
            } else {
                match.ballDirection = match.ballDirection.rotateByDegrees(20);
            }
        } else {
            match.ballDirection = match.ballDirection.rotateByDegrees(random);
        }
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
    someoneDisconnect(match: GameInterface) {
        if (match.disconnection) {
            this.gameGateway.updateFrontMenu(match, "Disconnection");
            if (match.watchersSockets.length > 0) {
                this.gameGateway.endStreamPlayerDisconnect(match);
            }
        }
        return match.disconnection;
    }

    getScore(match: GameInterface): [number, number] {
        return [match.player1Score, match.player2Score];
    }

    async movePaddleIA(match: GameInterface): Promise<GameInterface> {
        if (
            this.getBallY(match) + match.ballHeigth / 2 <
            this.getPaddleY(match.player2Position, match) -
                match.paddleHeigth / 2
        ) {
            // down
            if (match.player2Position > 0) {
                match.player2Position -= match.screenHeigth / 10;
            }
        } else if (
            this.getBallY(match) - match.ballHeigth / 2 >
            this.getPaddleY(match.player2Position, match) +
                match.paddleHeigth / 2
        ) {
            // up
            if (match.player2Position < match.screenHeigth) {
                match.player2Position += match.screenHeigth / 10;
            }
        }
        return match;
    }

    // Game loop
    async launchMatch(
        match: GameInterface
    ): Promise<[error: boolean, match: GameInterface]> {
        await this.countDown(match);
        this.gameGateway.updateFrontMenu(match, "Game");
        var [score1, score2] = this.getScore(match);
        match = await this.startBallDir(match);
        while (true) {
            match = games.get(match.uuid);
            if (!match) return [true, undefined];
            match = await this.computeBallDirection(match);
            match = await this.moveBall(match);
            if (match.solo === true) {
                match = await this.movePaddleIA(match);
            }
            await this.gameGateway.sendPos(match);
            if (this.someoneGoal(match, score1, score2)) {
                if (match.player1Score >= 15 || match.player2Score >= 15) {
                    break;
                } else {
                    [score1, score2] = this.getScore(match);
                    match = await this.startBallDir(match);
                    await this.sleep(1000);
                }
            }
            if (this.someoneDisconnect(match)) {
                return [true, undefined];
            }
            games.set(match.uuid, match);
            await this.sleep(16);
        }
        return [false, match];
    }

    // Set the defaults settings for the game
    async createMatch(
        game: GameEntity,
        player1: UserEntity,
        player2: UserEntity
    ): Promise<GameInterface> {
        const screenHeigth = 1000;
        const screenWidth = 1000;
        const paddleHeigth = 10;
        const ballSize = 2.5;
        const match: GameInterface = {
            uuid: game.uuid,
            player1Username: player1.username,
            player2Username: player2.username,
            sockets: player1.socketId.concat(player2.socketId),
            player1Socket: player1.socketId,
            player2Socket: player2.socketId,
            player1Score: 0,
            player2Score: 0,
            player1Position: screenHeigth / 2,
            player2Position: screenHeigth / 2,
            ballPosition: new Vector(screenWidth / 2, screenHeigth / 2),
            ballDirection: new Vector(1, 0),
            ballSpeed: 9,
            screenHeigth: screenHeigth,
            screenWidth: screenWidth,
            paddleHeigth: (screenHeigth / 100) * paddleHeigth,
            paddleWidth: (screenWidth / 100) * 2,
            paddleOffset: (screenWidth / 100) * 1,
            ballWidth: (screenWidth / 100) * ballSize,
            ballHeigth: (screenHeigth / 100) * ballSize,
            disconnection: false,
            lose: false,
            watchersSockets: [],
            power_up: game.options.power_up,
            solo: game.options.solo,
        };

        games.set(game.uuid, match);
        await this.gameGateway.sendGameID(match);
        await this.gameGateway.sendPos(match);
        return match;
    }

    async getPlayers(
        game: GameEntity
    ): Promise<[player1: UserEntity, player2: UserEntity]> {
        let player1 = await this.userService.getByID(game.hostID);
        await this.userService.setStatusByID(player1.uuid, "ingame");
        if (!player1) {
            throw new UnauthorizedException("User not found");
        }
        if (player1.socketId.length === 0) {
            throw new UnauthorizedException("Invalid user sockets");
        }

        if (game.options.solo === false) {
            var player2 = await this.userService.getByID(game.guestID);
            await this.userService.setStatusByID(player2.uuid, "ingame");
            if (!player2) {
                throw new UnauthorizedException("User not found");
            }
            if (player2.socketId.length === 0) {
                throw new UnauthorizedException("Invalid user sockets");
            }
        } else {
            var player2 = new UserEntity();
            player2.username = "ia";
        }

        return [player1, player2];
    }

    // Send info to the frontend via socket and start a game
    async startGame(game: GameEntity) {
        let [player1, player2] = await this.getPlayers(game);
        let match = await this.createMatch(game, player1, player2);
        let [gameError, results] = await this.launchMatch(match);

        if (gameError === false) {
            if (results.solo === true) {
                this.gameGateway.updateFrontMenu(results, "Results");
                this.gameGateway.streamResults(results, game.uuid);
                await this.userService.setStatusByID(player1.uuid, "online");
            } else {
                let p1 = await this.userService.getByID(player1.uuid);
                let p2 = await this.userService.getByID(player2.uuid);
                await this.userService.saveGameResult(
                    results,
                    player1.uuid,
                    player2.uuid
                );
                let player1Rank = await this.userService.getLeaderBoardRank(p1);
                let player2Rank = await this.userService.getLeaderBoardRank(p2);
                this.gameGateway.emitGameResults(
                    results,
                    player1Rank,
                    player2Rank
                );
                this.gameGateway.updateFrontMenu(results, "Results");
                this.gameGateway.streamResults(results, game.uuid);
                await this.userService.setStatusByID(player1.uuid, "online");
                await this.userService.setStatusByID(player2.uuid, "online");
            }
        } else if (match.solo === false) {
            await this.userService.setStatusIfNotOffline(
                player1.uuid,
                "online"
            );
            await this.userService.setStatusIfNotOffline(
                player2.uuid,
                "online"
            );
        }
        await this.gameGateway.emitEndGame(game.uuid);
        await this.gameRepository.remove(game);
        games.delete(game.uuid);
    }

    // Join a game stream
    async watchStream(uuid: string, game_id: string) {
        const user = await this.userService.getByID(uuid);
        if (!user || user.socketId.length === 0) {
            throw new UnauthorizedException("User not found.");
        }
        let match: GameInterface = games.get(game_id);
        if (!match) {
            return;
        }
        match.watchersSockets.push(user.socketId[0]);
        games.set(game_id, match);
        await this.gameGateway.sendGameID(match);
        await this.gameGateway.sendPos(match);
    }

    // Leave a game stream
    async leaveStream(uuid: string, game_id: string) {
        const user = await this.userService.getByID(uuid);
        if (user && user.socketId.length > 0) {
            let match: GameInterface = games.get(game_id);
            if (match) {
                let index = match.watchersSockets.findIndex(
                    (element) => element === user.socketId[0]
                );
                if (index !== -1) {
                    match.watchersSockets.splice(index, 1);
                    games.set(game_id, match);
                }
            }
        }
    }

    //Mode Bonus
    //Balle qui disparait 1,5 s
    //padlle plus grand
    //paddle plus petit
    //freeze paddle 1,5 s
    //Balle acceleration 1,5 s
    //Balle deceleration 1,5 s
}
