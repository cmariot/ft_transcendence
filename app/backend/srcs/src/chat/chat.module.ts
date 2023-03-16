import { Module } from "@nestjs/common";
import { ChatController } from "./controllers/chat.controller";
import { ChatService } from "./services/chat.service";
import { ChatGateway } from "../sockets/gateways/chat.gateway";
import { UsersService } from "src/users/services/users.service";
import { UsersModule } from "src/users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatEntity } from "./entities/chat.entity";
import { UserEntity } from "src/users/entity/user.entity";
import { GameEntity } from "src/game/entities/game.entity";
import { GameService } from "src/game/services/game.service";
import { SocketModule } from "src/sockets/socket.module";
import { GameGateway } from "src/sockets/gateways/game.gateway";
import { UserGateway } from "src/sockets/gateways/user.gateway";

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
        GameGateway,
        UserGateway,
    ],
    controllers: [ChatController],
})
export class ChatModule {}
