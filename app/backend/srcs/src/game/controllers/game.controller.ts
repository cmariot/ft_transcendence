import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { isLogged } from "src/auth/guards/authentification.guards";
import { InvitationResponseDto, InvitationDto } from "../dtos/GameUtility.dto";
import { MatchmakingService } from "../services/matchmaking.service";
import { GameService } from "../services/game.service";

@Controller("game")
export class GameController {
    constructor(private matchmakingService: MatchmakingService) {}

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
    async invitation(@Req() req, @Body() users: InvitationDto) {
        return await this.matchmakingService.invitation(users);
    }

    // Il doit recevoir le gars qu'il a invite (hostuuid), son username(guest)
    @Post("invitation/response")
    @UseGuards(isLogged)
    async responseInvitation(@Req() req, @Body() users: InvitationResponseDto) {
        return await this.matchmakingService.ResponseInvitation(users);
    }

    @Get("current")
    @UseGuards()
    async getCurrentGames() {
        return await this.matchmakingService.getCurrentGames();
    }
}
