import { Module } from "@nestjs/common";
import { UsersService } from "./services/users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { UsersController } from "./controllers/users.controller";
import { SocketService } from "src/sockets/socket.service";
import { GameService } from "src/game/services/game.service";
import { GameEntity } from "src/game/entities/game.entity";
import { ChatService } from "src/chat/services/chat.service";
import { ChatEntity } from "src/chat/entities/chat.entity";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, GameEntity, ChatEntity])],
    providers: [UsersService, SocketService, GameService],
    controllers: [UsersController],
    exports: [UsersService],
})
export class UsersModule {}
