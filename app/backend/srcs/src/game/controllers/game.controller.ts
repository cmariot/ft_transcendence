import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { isLogged } from "src/auth/guards/authentification.guards";
import {
    InvitationResponseDto,
    UsernameDto,
    InvitationDto,
} from "../dtos/GameUtility.dto";
import { GameService } from "../services/game.service";

@Controller("game")
export class GameController {
    constructor(private gameService: GameService) {}

    // Rejoint la queue
    @Post("queue")
    @UseGuards(isLogged)
    async join_queue(@Req() req, @Body() user: UsernameDto) {
        return await this.gameService.joinQueue(user.username);
    }

    // pour cancel quand il est dans la queue
    @Post("queue/cancel")
    @UseGuards(isLogged)
    async cancel_queue(@Req() req, @Body() user: UsernameDto) {
        return await this.gameService.cancelQueue(user.username);
    }

    @Post("invitation/send")
    @UseGuards(isLogged)
    async invitation(@Req() req, @Body() users: InvitationDto) {
        return await this.gameService.invitation(users);
    }

    // Il doit recevoir le gars qu'il a invite (hostuuid), son username(guest)
    @Post("invitation/response")
    @UseGuards(isLogged)
    async responseInvitation(@Req() req, @Body() users: InvitationResponseDto) {
        return await this.gameService.ResponseInvitation(users);
    }
}
