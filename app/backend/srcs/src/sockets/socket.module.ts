import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/users/entity/user.entity";
import { ChatEntity } from "src/chat/entities/chat.entity";
import { GameEntity } from "src/game/entities/game.entity";
import { UsersService } from "src/users/services/users.service";
import { GameService } from "src/game/services/game.service";
import { ChatService } from "src/chat/services/chat.service";
import { SocketService } from "./gateways/socket.gateway";
import { UsersModule } from "src/users/users.module";
import { GameModule } from "src/game/game.module";
import { ChatGateway } from "./gateways/chatGateway";
import { GameGateway } from "./gateways/gameGateways";
import { ConnectionGateway } from "./gateways/connection.gateway";
import { UserGateway } from "./gateways/user.gateway";

@Module({
    imports: [
        TypeOrmModule.forFeature([GameEntity, UserEntity, ChatEntity]),
        UsersModule,
        GameModule,
    ],
    providers: [
        UsersService,
        ConnectionGateway,
        UserGateway,
        GameService,
        ChatService,
        SocketService,
        ChatGateway,
        GameGateway,
    ],
})
export class SocketModule {}
