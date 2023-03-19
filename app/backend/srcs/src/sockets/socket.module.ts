import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/users/entity/user.entity";
import { ChatEntity } from "src/chat/entities/chat.entity";
import { GameEntity } from "src/game/entities/game.entity";
import { UsersService } from "src/users/services/users.service";
import { GameService } from "src/game/services/game.service";
import { ChatService } from "src/chat/services/chat.service";
import { ChatGateway } from "./gateways/chat.gateway";
import { GameGateway } from "./gateways/game.gateway";
import { StatusGateway } from "./gateways/status.gateway";
import { UserGateway } from "./gateways/user.gateway";
import { MatchmakingService } from "src/game/services/matchmaking.service";

@Module({
    imports: [TypeOrmModule.forFeature([GameEntity, UserEntity, ChatEntity])],
    providers: [
        UsersService,
        UserGateway,
        GameService,
        ChatService,
        ChatGateway,
        GameGateway,
        StatusGateway,
        MatchmakingService,
    ],
})
export class SocketModule {}
