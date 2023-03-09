import { Module } from "@nestjs/common";
import { ChatController } from "./controllers/chat.controller";
import { SocketService } from "src/sockets/socket.service";
import { UsersService } from "src/users/services/users.service";
import { GameService } from "src/game/services/game.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GameEntity } from "src/game/entities/game.entity";
import { UserEntity } from "src/users/entity/user.entity";
import { ChatEntity } from "./entities/chat.entity";
import { ChatService } from "./services/chat.service";

@Module({
    imports: [TypeOrmModule.forFeature([GameEntity, UserEntity, ChatEntity])],
    providers: [GameService, UsersService, SocketService, ChatService],
    controllers: [ChatController],
})
export class ChatModule {}
