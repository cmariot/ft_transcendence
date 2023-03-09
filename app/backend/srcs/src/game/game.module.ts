import { Module } from "@nestjs/common";
import { UsersService } from "src/users/services/users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/users/entity/user.entity";
import { GameService } from "./services/game.service";
import { GameController } from "./controllers/game.controller";
import { GameEntity } from "./entities/game.entity";
import { ChatEntity } from "src/chat/entities/chat.entity";
import { SocketService } from "src/sockets/socket.service";

@Module({
    imports: [TypeOrmModule.forFeature([GameEntity, UserEntity, ChatEntity])],
    providers: [UsersService, UsersService, SocketService, GameService],
    controllers: [GameController],
})
export class GameModule {}
