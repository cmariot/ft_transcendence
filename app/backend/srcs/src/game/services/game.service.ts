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

    getPaddleY(
        paddlePosition: number,
        player: number,
        match: GameInterface
    ): number {
        var paddleHeigth: number;
        if (player == 1) {
            paddleHeigth = match.paddle1Heigth;
        } else {
            paddleHeigth = match.paddle2Heigth;
        }

        const posPaddleYPercentage =
            (paddlePosition / match.screenHeigth) * 100;
        const realPaddleYPercentage =
            posPaddleYPercentage *
            ((match.screenHeigth - paddleHeigth) / match.screenHeigth);
        return (
            paddleHeigth / 2 +
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

    //async hitPaddleFront(
    //match: GameInterface
    //): Promise<{ hit: boolean; angle: Vector | null }> {
    //const ballY = this.getBallY(match);
    //const ballX = this.getBallX(match);
    //for (let player = 1; player <= 2; player++) {
    //var paddlePosition: number;
    //var paddleX: number;
    //var isHit: boolean;
    //var paddleHeigth: number;
    //if (player === 1) {
    //paddlePosition = match.player1Position;
    //paddleX = 0 + match.paddleOffset + match.paddleWidth;
    //isHit = ballX <= paddleX + match.ballWidth * 0.5;
    //paddleHeigth = match.paddle1Heigth;
    //} else {
    //paddlePosition = match.player2Position;
    //paddleX =
    //match.screenWidth - match.paddleOffset - match.paddleWidth;
    //isHit = ballX >= paddleX - match.ballWidth * 0.5;
    //paddleHeigth = match.paddle2Heigth;
    //}
    //const paddleY = this.getPaddleY(paddlePosition, player, match);
    //if (
    //isHit &&
    //ballY <= paddleY + paddleHeigth / 2 &&
    //ballY >= paddleY - paddleHeigth / 2
    //) {
    //let angle = new Vector(
    //-match.ballDirection.x,
    //match.ballDirection.y + (ballY - paddleY) / paddleY
    //);
    //return { hit: true, angle: angle };
    //}
    //}
    //return { hit: false, angle: null };
    //}

    async hitPaddleFront(
        match: GameInterface
    ): Promise<{ hit: boolean; angle: Vector | null }> {
        const ballY = this.getBallY(match);
        const ballX = this.getBallX(match);
        const maxBounceAngle = (5 * Math.PI) / 12;

        for (let player = 1; player <= 2; player++) {
            let paddlePosition: number;
            let paddleX: number;
            let isHit: boolean;
            let paddleHeight: number;
            if (player === 1) {
                paddlePosition = match.player1Position;
                paddleX = 0 + match.paddleOffset + match.paddleWidth;
                isHit = ballX <= paddleX + match.ballWidth * 0.5;
                paddleHeight = match.paddle1Heigth;
            } else {
                paddlePosition = match.player2Position;
                paddleX =
                    match.screenWidth - match.paddleOffset - match.paddleWidth;
                isHit = ballX >= paddleX - match.ballWidth * 0.5;
                paddleHeight = match.paddle2Heigth;
            }
            const paddleY = this.getPaddleY(paddlePosition, player, match);
            if (
                isHit &&
                ballY <= paddleY + paddleHeight / 2 &&
                ballY >= paddleY - paddleHeight / 2
            ) {
                const relativeIntersectY = paddleY - ballY;
                const normalizedRelativeIntersectionY =
                    relativeIntersectY / (paddleHeight / 2);
                const bounceAngle =
                    normalizedRelativeIntersectionY * maxBounceAngle;

                let newDirectionX =
                    player === 1
                        ? Math.cos(bounceAngle)
                        : -Math.cos(bounceAngle);
                let newDirectionY = -Math.sin(bounceAngle);
                let newBallDirection = new Vector(newDirectionX, newDirectionY);

                return { hit: true, angle: newBallDirection };
            }
        }
        return { hit: false, angle: null };
    }

    async hitPaddleCorner(
        match: GameInterface
    ): Promise<{ hit: boolean; angle: Vector | null }> {
        const ballY = this.getBallY(match);
        const ballX = this.getBallX(match);
        for (let player = 1; player <= 2; player++) {
            var paddlePosition: number;
            var paddleX: number;
            var paddleHeigth: number;
            if (player === 1) {
                paddlePosition = match.player1Position;
                paddleX = 0 + match.paddleOffset + match.paddleWidth;
                paddleHeigth = match.paddle1Heigth;
            } else {
                paddlePosition = match.player2Position;
                paddleX =
                    match.screenWidth - match.paddleOffset - match.paddleWidth;
                paddleHeigth = match.paddle2Heigth;
            }

            const paddleY = this.getPaddleY(paddlePosition, player, match);
            if (
                ballY <= paddleY + paddleHeigth / 2 + match.ballHeigth / 2 &&
                ballY >= paddleY - paddleHeigth / 2 - match.ballHeigth / 2
            ) {
                let xa = paddleX;
                let ya = paddleY + paddleHeigth / 2;
                let xb = ballX;
                let yb = ballY;
                let ab = Math.sqrt(Math.pow(xb - xa, 2) + Math.pow(yb - ya, 2));
                if (ab <= match.ballHeigth / 2) {
                    return {
                        hit: true,
                        angle: new Vector(
                            -match.ballDirection.x,
                            match.ballDirection.y
                        ),
                    };
                }
                ya = paddleY - paddleHeigth / 2;
                ab = Math.sqrt(Math.pow(xb - xa, 2) + Math.pow(yb - ya, 2));
                if (ab <= match.ballHeigth / 2) {
                    return {
                        hit: true,
                        angle: new Vector(
                            -match.ballDirection.x,
                            match.ballDirection.y
                        ),
                    };
                }
            }
        }
        return { hit: false, angle: null };
    }

    async hitPaddleHorizontal(match: GameInterface): Promise<boolean> {
        const ballY = this.getBallY(match);
        const ballX = this.getBallX(match);
        var hit: boolean;
        var paddlePosition: number;
        var paddleX: number;
        var paddleY: number;
        var paddleHeigth: number;

        for (let player = 1; player <= 2; player++) {
            if (player === 1) {
                paddleX = 0 + match.paddleOffset + match.paddleWidth;
                hit = ballX < paddleX;
                paddlePosition = match.player1Position;
                paddleHeigth = match.paddle1Heigth;
            } else {
                paddleX =
                    match.screenWidth - match.paddleOffset - match.paddleWidth;
                hit = ballX > paddleX;
                paddlePosition = match.player2Position;
                paddleHeigth = match.paddle2Heigth;
            }
            paddleY = this.getPaddleY(paddlePosition, player, match);
            if (
                hit &&
                ballY <= paddleY + paddleHeigth / 2 + match.ballHeigth / 2 &&
                ballY >= paddleY - paddleHeigth / 2 - match.ballHeigth / 2
            ) {
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

    isBallOutsideScreen(match: GameInterface): {
        outside: boolean;
        match: GameInterface;
    } {
        if (match.ballPosition.x >= match.screenWidth) {
            match.player1Score++;
            return { outside: true, match: match };
        } else if (match.ballPosition.x <= 0) {
            match.player2Score++;
            return { outside: true, match: match };
        } else if (
            match.ballPosition.y >= match.screenHeigth ||
            match.ballPosition.y <= 0
        ) {
            return { outside: true, match: match };
        }
        return { outside: false, match: match };
    }

    async adjustBallPositionAfterHitFront(
        match: GameInterface
    ): Promise<Vector> {
        while (
            this.isBallOutsideScreen(match).outside === false &&
            (await this.hitPaddleFront(match)).hit === true
        ) {
            match.ballPosition = match.ballPosition.add(match.ballDirection);
        }
        return match.ballPosition;
    }

    async adjustBallPositionAfterHitCorner(
        match: GameInterface
    ): Promise<Vector> {
        while (
            this.isBallOutsideScreen(match).outside === false &&
            (await this.hitPaddleCorner(match)).hit === true
        ) {
            match.ballPosition = match.ballPosition.add(match.ballDirection);
        }
        return match.ballPosition;
    }

    async adjustBallPositionAfterHitHorizontal(
        match: GameInterface
    ): Promise<Vector> {
        while (
            this.isBallOutsideScreen(match).outside === false &&
            (await this.hitPaddleHorizontal(match)) === true
        ) {
            match.ballPosition = match.ballPosition.add(match.ballDirection);
        }
        return match.ballPosition;
    }

    async checkPowerUp(match: GameInterface): Promise<GameInterface> {
        const ball = new Vector(match.ballPosition.x, match.ballPosition.y);
        for (let i = 0; i < match.power_up_list.length; i++) {
            if (
                ball.subtract(match.power_up_list[i].position).length() <
                match.ballHeigth
            ) {
                if (match.ballDirection.x < 0) {
                    if (match.power_up_player2.length === 0) {
                        match.power_up_player2 = match.power_up_list[i].type;
                    }
                } else {
                    if (match.power_up_player1.length === 0) {
                        match.power_up_player1 = match.power_up_list[i].type;
                    }
                }
                match.power_up_list.splice(i, 1);
            }
        }
        return match;
    }

    async moveBall(match: GameInterface): Promise<GameInterface> {
        if (match.start === false) {
            for (let i = 0; i < match.ballSpeed; i++) {
                match.ballPosition = match.ballPosition.add(
                    match.ballDirection
                );

                if (match.power_up === true) {
                    match = await this.checkPowerUp(match);
                }

                const outsideResponse = this.isBallOutsideScreen(match);
                if (outsideResponse.outside === true) {
                    return outsideResponse.match;
                }
                if (match.lose === false) {
                    const isHitPaddleFront = await this.hitPaddleFront(match);
                    if (
                        isHitPaddleFront.hit === true &&
                        isHitPaddleFront.angle !== null
                    ) {
                        match.ballDirection = isHitPaddleFront.angle;
                        match.ballPosition =
                            await this.adjustBallPositionAfterHitFront(match);
                        match.ballSpeed *= 1.05;
                        break;
                    }
                    const isHitPaddleCorner = await this.hitPaddleCorner(match);
                    if (
                        isHitPaddleCorner.hit === true &&
                        isHitPaddleCorner.angle !== null
                    ) {
                        match.ballDirection = isHitPaddleCorner.angle;
                        match.ballPosition =
                            await this.adjustBallPositionAfterHitCorner(match);
                        match.ballSpeed *= 1.05;
                        break;
                    }
                    if ((await this.hitPaddleHorizontal(match)) === true) {
                        match.ballDirection = new Vector(
                            match.ballDirection.x,
                            -match.ballDirection.y
                        );
                        match.ballPosition =
                            await this.adjustBallPositionAfterHitHorizontal(
                                match
                            );
                        match.lose = true;
                        break;
                    }
                }
            }
        }
        return match;
    }

    async start(match: GameInterface) {
        match.start = false;
    }

    // engagement position
    // engagement direction
    // engagement angle
    async startBallDir(match: GameInterface): Promise<GameInterface> {
        match.lose = false;
        match.ballSpeed = 10;
        match.ballPosition = new Vector(
            match.screenWidth / 2,
            match.screenHeigth / 2
        );
        match.start = true;
        setTimeout(() => {
            this.start(match);
        }, 3 * 1000);
        if (match.player1Score === 0 && match.player2Score === 0) {
            if (getRandomBetween(0, 1) === 1) {
                match.ballDirection = new Vector(1, 0);
            } else {
                match.ballDirection = new Vector(-1, 0);
            }
            const random = getRandomBetween(-45, 45);
            if (random === 0) {
                if (getRandomBetween(0, 1) === 0) {
                    match.ballDirection =
                        match.ballDirection.rotateByDegrees(-20);
                } else {
                    match.ballDirection =
                        match.ballDirection.rotateByDegrees(20);
                }
            } else {
                match.ballDirection =
                    match.ballDirection.rotateByDegrees(random);
            }
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
            this.gameGateway.emitEndGame(match.uuid);
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
        if (match.freeze2 === true) return match;
        if (
            // move down
            this.getBallY(match) + match.ballHeigth / 2 <
            this.getPaddleY(match.player2Position, 2, match) -
                match.paddle2Heigth / 2
        ) {
            if (match.player2Position > 0) {
                match.player2Position -= match.screenHeigth / 10;
            }
        } else if (
            // move up
            this.getBallY(match) - match.ballHeigth / 2 >
            this.getPaddleY(match.player2Position, 2, match) +
                match.paddle2Heigth / 2
        ) {
            if (match.player2Position < match.screenHeigth) {
                match.player2Position += match.screenHeigth / 10;
            }
        }
        return match;
    }

    async spawnPowerUp(match: GameInterface): Promise<GameInterface> {
        const chance = getRandomBetween(0, 100);
        if (chance === 42) {
            const list = [
                "speed",
                "slow",
                "biggerPaddle",
                "smallerPaddle",
                "freeze",
            ];
            const random = getRandomBetween(0, list.length - 1);
            match.power_up_list.push({
                type: list[random],
                position: new Vector(
                    getRandomBetween(
                        0 + match.paddleWidth + match.paddleOffset,
                        match.screenWidth -
                            match.paddleWidth -
                            match.paddleOffset
                    ),
                    getRandomBetween(0, match.screenHeigth)
                ),
            });
        }
        return match;
    }

    async increaseSpeed(match: GameInterface): Promise<GameInterface> {
        const three_seconds = 3000;
        match.ballSpeed *= 2;
        var [p1score, p2score] = [match.player1Score, match.player2Score];
        setTimeout(async () => {
            if (
                p1score === match.player1Score &&
                p2score === match.player2Score
            ) {
                match.ballSpeed /= 2;
            }
        }, three_seconds);
        return match;
    }

    async decreaseSpeed(match: GameInterface): Promise<GameInterface> {
        const three_seconds = 3000;
        match.ballSpeed /= 3;
        var [p1score, p2score] = [match.player1Score, match.player2Score];
        setTimeout(async () => {
            if (
                p1score === match.player1Score &&
                p2score === match.player2Score
            ) {
                match.ballSpeed *= 3;
            }
        }, three_seconds);
        return match;
    }

    async increasePaddle(
        match: GameInterface,
        player: number
    ): Promise<GameInterface> {
        const ten_seconds = 10000;
        if (player === 1) {
            match.paddle1Heigth *= 2;
        } else {
            match.paddle2Heigth *= 2;
        }
        setTimeout(async () => {
            if (player === 1) {
                match.paddle1Heigth /= 2;
            } else {
                match.paddle2Heigth /= 2;
            }
        }, ten_seconds);
        return match;
    }

    async decreasePaddle(
        match: GameInterface,
        player: number
    ): Promise<GameInterface> {
        const ten_seconds = 10000;
        if (player === 1) {
            match.paddle2Heigth /= 2;
        } else {
            match.paddle1Heigth /= 2;
        }
        setTimeout(async () => {
            if (player === 1) {
                match.paddle2Heigth *= 2;
            } else {
                match.paddle1Heigth *= 2;
            }
        }, ten_seconds);
        return match;
    }

    async freeze(match: GameInterface, player: number): Promise<GameInterface> {
        const one_second = 1000;
        if (player === 1) {
            match.freeze2 = true;
        } else {
            match.freeze1 = true;
        }
        setTimeout(async () => {
            if (player === 1) {
                match.freeze2 = false;
            } else {
                match.freeze1 = false;
            }
        }, one_second);
        return match;
    }

    async checkPowerUpUse(
        match: GameInterface,
        recursive: boolean
    ): Promise<GameInterface> {
        var used: boolean;
        var power_up: string;
        var player: number;

        if (recursive === true) {
            player = 1;
            used = match.player1_usePower;
            power_up = match.power_up_player1;
        } else {
            player = 2;
            used = match.player2_usePower;
            power_up = match.power_up_player2;
        }
        if (used === true && power_up) {
            if (power_up === "speed") {
                match = await this.increaseSpeed(match);
            } else if (power_up === "slow") {
                match = await this.decreaseSpeed(match);
            } else if (power_up === "biggerPaddle") {
                match = await this.increasePaddle(match, player);
            } else if (power_up === "smallerPaddle") {
                match = await this.decreasePaddle(match, player);
            } else if (power_up === "freeze") {
                match = await this.freeze(match, player);
            }

            if (player === 1) {
                match.power_up_player1 = "";
                match.player1_usePower = false;
            } else {
                match.power_up_player2 = "";
                match.player2_usePower = false;
            }
        }
        if (recursive === true) {
            match = await this.checkPowerUpUse(match, false);
        }
        return match;
    }

    // Game loop
    async launchMatch(
        match: GameInterface | undefined
    ): Promise<[error: boolean, match: GameInterface | undefined]> {
        if (match === undefined) return [false, undefined];
        await this.countDown(match);
        this.gameGateway.updateFrontMenu(match, "Game");
        // new stream available
        this.gameGateway.newStreamAvailable(match);
        var [score1, score2] = this.getScore(match);
        match = await this.startBallDir(match);
        while (true) {
            match = games.get(match.uuid);
            if (!match) return [true, undefined];
            match = await this.computeBallDirection(match);
            match = await this.moveBall(match);
            if (match.power_up === true) {
                match = await this.spawnPowerUp(match);
                match = await this.checkPowerUpUse(match, true);
            }
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
            await this.sleep(20);
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
            ballSpeed: 10,
            screenHeigth: screenHeigth,
            screenWidth: screenWidth,
            paddle1Heigth: (screenHeigth / 100) * paddleHeigth,
            paddle2Heigth: (screenHeigth / 100) * paddleHeigth,
            paddleWidth: (screenWidth / 100) * 2,
            paddleOffset: (screenWidth / 100) * 1,
            ballWidth: (screenWidth / 100) * ballSize,
            ballHeigth: (screenHeigth / 100) * ballSize,
            disconnection: false,
            lose: false,
            watchersSockets: [],
            power_up: game.options.power_up,
            solo: game.options.solo,
            power_up_list: new Array<{ type: string; position: Vector }>(),
            power_up_player1: "",
            power_up_player2: "",
            player1_usePower: false,
            player2_usePower: false,
            freeze1: false,
            freeze2: false,
            start: true,
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
        if (!player1) {
            throw new UnauthorizedException("User not found");
        }
        await this.userService.setStatusByID(player1.uuid, "ingame");
        if (player1.socketId.length === 0) {
            throw new UnauthorizedException("Invalid user sockets");
        }
        await this.gameGateway.joinRoom(player1.socketId[0], game.uuid);
        if (game.options.solo === false) {
            var player2 = await this.userService.getByID(game.guestID);
            if (!player2) {
                throw new UnauthorizedException("User not found");
            }
            await this.userService.setStatusByID(player2.uuid, "ingame");
            if (player2.socketId.length === 0) {
                throw new UnauthorizedException("Invalid user sockets");
            }
            await this.gameGateway.joinRoom(player2.socketId[0], game.uuid);
        } else {
            var player2: UserEntity | null = new UserEntity();
            if (player2 !== null) {
                player2.username = "gigachad";
            }
        }
        return [player1, player2];
    }

    // Send info to the frontend via socket and start a game
    async startGame(game: GameEntity) {
        let [player1, player2] = await this.getPlayers(game);
        let match = await this.createMatch(game, player1, player2);
        let [gameError, results] = await this.launchMatch(match);

        if (results === undefined) {
            await this.gameRepository.remove(game);
            games.delete(game.uuid);
            await this.userService.setStatusIfNotOffline(
                player1.uuid,
                "online"
            );
            await this.userService.setStatusIfNotOffline(
                player2.uuid,
                "online"
            );
            await this.gameGateway.deleteRoom(game.uuid);
            return;
        }

        if (gameError === false) {
            if (results.solo === true) {
                this.gameGateway.updateFrontMenu(results, "Results");
                this.gameGateway.streamResults(results, game.uuid);
                await this.userService.setStatusByID(player1.uuid, "online");
            } else {
                await this.userService.saveGameResult(
                    results,
                    player1.uuid,
                    player2.uuid
                );
                let p1 = await this.userService.getByID(player1.uuid);
                let p2 = await this.userService.getByID(player2.uuid);
                if (p1 && p2) {
                    await this.userService.getLeaderBoardRank(p1);
                    await this.userService.getLeaderBoardRank(p2);
                    await this.gameGateway.emitGameResults(results);
                }
                await this.gameGateway.updateFrontMenu(results, "Results");
                await this.gameGateway.streamResults(results, game.uuid);
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
        await this.gameGateway.deleteRoom(game.uuid);
        await this.gameRepository.remove(game);
        games.delete(game.uuid);
    }

    // Join a game stream
    async watchStream(uuid: string, game_id: string) {
        const user = await this.userService.getByID(uuid);
        if (!user || user.socketId.length === 0) {
            throw new UnauthorizedException("User not found.");
        } else if (user.status === "ingame") {
            throw new UnauthorizedException(
                "You cannot watch a stream when you're ingame."
            );
        }
        let match: GameInterface | undefined = games.get(game_id);
        if (!match) {
            throw new UnauthorizedException("Game not found.");
        }
        await this.gameGateway.joinRoom(user.socketId[0], game_id);
        match.watchersSockets.push(user.socketId[0]);
        games.set(game_id, match);
        await this.gameGateway.sendGameID(match);
        await this.gameGateway.sendPos(match);
    }

    // Leave a game stream
    async leaveStream(uuid: string, game_id: string) {
        const user = await this.userService.getByID(uuid);
        if (user && user.socketId.length > 0) {
            await this.gameGateway.leaveRoom(user.socketId[0], game_id);
            let match: GameInterface | undefined = games.get(game_id);
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
}
