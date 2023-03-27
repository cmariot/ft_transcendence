import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { isLogged } from "src/auth/guards/authentification.guards";
import {
    InvitationResponseDto,
    InvitationDto,
    GameIdDto,
    UsernameDto,
} from "../dtos/GameUtility.dto";
import { MatchmakingService } from "../services/matchmaking.service";
import { GameService } from "../services/game.service";

@Controller("game")
export class GameController {
    constructor(
        private matchmakingService: MatchmakingService,
        private gameService: GameService
    ) {}

    // Rejoint la queue
    @Post("queue")
    @UseGuards(isLogged)
    async join_queue(@Req() req) {
        return await this.matchmakingService.joinQueue(req.user.uuid);
    }

    // pour cancel quand il est dans la queue
    @Post("queue/cancel")
    @UseGuards(isLogged)
    async cancel_queue(@Req() req) {
        return await this.matchmakingService.cancelQueue(req.user.uuid);
    }

    @Post("invitation/send")
    @UseGuards(isLogged)
    async invitation(@Req() req, @Body() player2: UsernameDto) {
        return await this.matchmakingService.invitation(
            req.user.uuid,
            player2.username
        );
    }

    @Post("invitation/accept")
    @UseGuards(isLogged)
    async accept_invitation(@Req() req, @Body() player1: UsernameDto) {
        return await this.matchmakingService.acceptInvitation(
            req.user.uuid,
            player1.username
        );
    }

    // List of curent 'playing' games
    @Get("current")
    @UseGuards(isLogged)
    async getCurrentGames() {
        return await this.matchmakingService.getCurrentGames();
    }

    // Join a stream
    @Post("watch")
    @UseGuards(isLogged)
    async watchGame(@Req() req, @Body() gameId: GameIdDto) {
        return await this.gameService.watchStream(
            req.user.uuid,
            gameId.game_id
        );
    }

    // Leave a stream
    @Post("leaveStream")
    @UseGuards(isLogged)
    async leaveStream(@Req() req, @Body() gameId: GameIdDto) {
        return await this.gameService.leaveStream(
            req.user.uuid,
            gameId.game_id
        );
    }
}
