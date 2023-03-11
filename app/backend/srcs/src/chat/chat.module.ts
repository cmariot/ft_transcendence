import { Module } from "@nestjs/common";
import { ChatController } from "./controllers/chat.controller";
import { ChatService } from "./services/chat.service";
import { ChatGateway } from "../sockets/gateways/chatGateway";
import { SocketService } from "../sockets/gateways/socket.gateway";
import { UsersService } from "src/users/services/users.service";
import { UsersModule } from "src/users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatEntity } from "./entities/chat.entity";
import { UserEntity } from "src/users/entity/user.entity";
import { GameEntity } from "src/game/entities/game.entity";
import { GameService } from "src/game/services/game.service";
import { SocketModule } from "src/sockets/socket.module";
import { GameGateway } from "src/sockets/gateways/gameGateways";

@Module({
    imports: [
        TypeOrmModule.forFeature([ChatEntity, UserEntity, GameEntity]),
        UsersModule,
        SocketModule,
    ],
    providers: [
        ChatGateway,
        ChatService,
        UsersService,
        GameService,
        SocketService,
        GameGateway,
    ],
    controllers: [ChatController],
})
export class ChatModule {}
