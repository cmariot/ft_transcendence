import { Module } from "@nestjs/common";
import { ChatController } from "./controllers/chat.controller";
import { ChatService } from "./services/chat.service";
import { ChatGateway } from "./gateways/ChatGateway";
import { SocketService } from "./services/socket.service";
import { UsersService } from "src/users/services/users.service";
import { UsersModule } from "src/users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatEntity } from "./entities/chat.entity";
import { UserEntity } from "src/users/entity/user.entity";
import { GameEntity } from "src/game/entities/game.entity";
import { GameModule } from "src/game/game.module";
import { GameService } from "src/game/services/game.service";
import { GameGateway } from "src/game/gateways/GameGateways";

@Module({
    imports: [
        TypeOrmModule.forFeature([ChatEntity, UserEntity, GameEntity]),
        UsersModule,
        ChatModule,
        GameModule,
    ],
    providers: [
        SocketService,
        ChatGateway,
        ChatService,
        UsersService,
        GameService,
        GameGateway,
    ],
    controllers: [ChatController],
})
export class ChatModule {}
