import { Module, forwardRef } from "@nestjs/common";
import { UsersService } from "src/users/services/users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/users/entity/user.entity";
import { ChatEntity } from "src/chat/entities/chat.entity";
import { GameEntity } from "src/game/entities/game.entity";
import { GameService } from "src/game/services/game.service";
import { ChatService } from "src/chat/services/chat.service";
import { SocketService } from "./socket.service";

@Module({
    imports: [TypeOrmModule.forFeature([GameEntity, UserEntity, ChatEntity])],
    providers: [GameService, UsersService, ChatService],
    exports: [SocketService],
})
export class SocketModule {}
