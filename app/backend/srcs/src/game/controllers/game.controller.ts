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

import { UsersService } from "src/users/services/users.service";
import { UsernameDto } from "../dtos/GameUtility.dto";
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
    async join_queue(@Req() req, @Body() username: UsernameDto) {
        return await this.gameService.joinQueue(username);
    }
}
