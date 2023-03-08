import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Post,
    Req,
    UnauthorizedException,
    UseGuards,
} from "@nestjs/common";
import { isLogged } from "src/auth/guards/authentification.guards";
import { UserEntity } from "src/users/entity/user.entity";

import { UsersService } from "src/users/services/users.service";
import {
    InvitationResponseDto,
    UsernameDto,
    InvitationDto,
} from "../dtos/GameUtility.dto";
import { GameService } from "../services/game.service";

@Controller("game")
export class GameController {
    constructor(
        private userService: UsersService,
        private gameService: GameService
    ) {}

    // Rejoint la queue
    @Post("queue")
    @UseGuards(isLogged)
    async join_queue(@Req() req, @Body() user: UsernameDto) {
        return await this.gameService.joinQueue(user.username);
    }

    //pour cancel quand il est dans la queue
    @Post("queue/cancel")
    @UseGuards(isLogged)
    async cancel_queue(@Req() req, @Body() user: UsernameDto) {
        let player: UserEntity = await this.userService.getByUsername(
            user.username
        );
        if (!player) {
            throw new HttpException("User not found", HttpStatus.NOT_FOUND);
        }
        return await this.gameService.cancelQueue(player);
    }

    @Post("invitation/send")
    @UseGuards(isLogged)
    async invitation(@Req() req, @Body() users: InvitationDto) {
        return await this.gameService.invitation(users);
    }

    //Il doit recevoir le gars qu'il a invite(hostuuid), son username(guest)
    @Post("invitation/response")
    @UseGuards(isLogged)
    async responseInvitation(@Req() req, @Body() users: InvitationResponseDto) {
        return await this.gameService.ResponseInvitation(users);
    }
}
