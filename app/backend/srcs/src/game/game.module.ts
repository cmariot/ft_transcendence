import { Module } from "@nestjs/common";
import { UsersService } from "src/users/services/users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/users/entity/user.entity";
import { GameService } from "./services/game.service";
import { GameController } from "./controllers/game.controller";
import { GameEntity } from "./entities/game.entity";
import { GameGateway } from "../sockets/gateways/game.gateway";
import { UserGateway } from "src/sockets/gateways/user.gateway";
import { MatchmakingService } from "./services/matchmaking.service";

@Module({
    imports: [TypeOrmModule.forFeature([GameEntity, UserEntity])],
    providers: [
        GameService,
        MatchmakingService,
        UsersService,
        GameGateway,
        UserGateway,
    ],
    controllers: [GameController],
})
export class GameModule {}
