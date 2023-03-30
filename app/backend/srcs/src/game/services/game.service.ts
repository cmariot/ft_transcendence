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
        match: GameInterface
    ): Promise<{ hit: boolean; angle: Vector | null }> {
        const ballY = this.getBallY(match);
        const ballX = this.getBallX(match);
        for (let player = 1; player <= 2; player++) {
            var paddlePosition: number;
            var paddleX: number;
            var isHit: boolean;
            if (player === 1) {
                paddlePosition = match.player1Position;
                paddleX = 0 + match.paddleOffset + match.paddleWidth;
                isHit = ballX <= paddleX + match.ballWidth * 0.5;
            } else {
                paddlePosition = match.player2Position;
                paddleX =
                    match.screenWidth - match.paddleOffset - match.paddleWidth;
                isHit = ballX >= paddleX - match.ballWidth * 0.5;
            }
            const paddleY = this.getPaddleY(paddlePosition, match);
            if (
                isHit &&
                ballY <= paddleY + match.paddleHeigth / 2 &&
                ballY >= paddleY - match.paddleHeigth / 2
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
        match: GameInterface
    ): Promise<{ hit: boolean; angle: Vector }> {
        const ballY = this.getBallY(match);
        const ballX = this.getBallX(match);
        for (let player = 1; player <= 2; player++) {
            var paddlePosition: number;
            var paddleX: number;
            if (player === 1) {
                paddlePosition = match.player1Position;
                paddleX = 0 + match.paddleOffset + match.paddleWidth;
            } else if (player === 2) {
                paddlePosition = match.player2Position;
                paddleX =
                    match.screenWidth - match.paddleOffset - match.paddleWidth;
            }
            const paddleY = this.getPaddleY(paddlePosition, match);
            if (
                ballY <=
                    paddleY + match.paddleHeigth / 2 + match.ballHeigth / 2 &&
                ballY >= paddleY - match.paddleHeigth / 2 - match.ballHeigth / 2
            ) {
                let xa = paddleX;
                let ya = paddleY + match.paddleHeigth / 2;
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
                ya = paddleY - match.paddleHeigth / 2;
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

        for (let player = 1; player <= 2; player++) {
            if (player === 1) {
                paddleX = 0 + match.paddleOffset + match.paddleWidth;
                hit = ballX < paddleX;
                paddlePosition = match.player1Position;
            } else if (player === 2) {
                paddleX =
                    match.screenWidth - match.paddleOffset - match.paddleWidth;
                hit = ballX > paddleX;
                paddlePosition = match.player2Position;
            }
            paddleY = this.getPaddleY(paddlePosition, match);
            if (
                hit &&
                ballY <=
                    paddleY + match.paddleHeigth / 2 + match.ballHeigth / 2 &&
                ballY >= paddleY - match.paddleHeigth / 2 - match.ballHeigth / 2
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
                    match.power_up_player2 = match.power_up_list[i].type;
                } else {
                    match.power_up_player1 = match.power_up_list[i].type;
                }
                match.power_up_list.splice(i, 1);
            }
        }
        return match;
    }

    async moveBall(match: GameInterface): Promise<GameInterface> {
        for (let i = 0; i < match.ballSpeed; i++) {
            match.ballPosition = match.ballPosition.add(match.ballDirection);

            if (match.power_up === true) {
                match = await this.checkPowerUp(match);
            }

            const outsideResponse = this.isBallOutsideScreen(match);
            if (outsideResponse.outside === true) {
                return outsideResponse.match;
            }
            if (match.lose === false) {
                const isHitPaddleFront = await this.hitPaddleFront(match);
                if (isHitPaddleFront.hit === true) {
                    match.ballDirection = isHitPaddleFront.angle;
                    match.ballPosition =
                        await this.adjustBallPositionAfterHitFront(match);
                    break;
                }
                const isHitPaddleCorner = await this.hitPaddleCorner(match);
                if (isHitPaddleCorner.hit === true) {
                    match.ballDirection = isHitPaddleCorner.angle;
                    match.ballPosition =
                        await this.adjustBallPositionAfterHitCorner(match);
                    break;
                }
                if ((await this.hitPaddleHorizontal(match)) === true) {
                    match.ballDirection = new Vector(
                        match.ballDirection.x,
                        -match.ballDirection.y
                    );
                    match.ballPosition =
                        await this.adjustBallPositionAfterHitHorizontal(match);
                    match.lose = true;
                    break;
                }
                1;
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

    async spawnPowerUp(match: GameInterface): Promise<GameInterface> {
        const list = [
            "speed",
            "slow",
            "biggerPaddle",
            "smallerPaddle",
            "freeze", // galere a gerer dans le back, a voir si on le garde
            "invisibility", // galere a gerer dans le front, a voir si on le garde
        ];
        const random = getRandomBetween(0, list.length - 1);
        const chance = getRandomBetween(0, 450);

        if (chance === 42) {
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
            console.log("Player " + player + " used " + power_up);
            // update match here

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
            power_up_list: new Array<{ type: string; position: Vector }>(),
            power_up_player1: "",
            power_up_player2: "",
            player1_usePower: false,
            player2_usePower: false,
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
            player2.username = "gigachad";
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
