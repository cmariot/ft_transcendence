import { Module } from "@nestjs/common";
import { ChatController } from "./controllers/chat.controller";
import { ChatService } from "./services/chat.service";
import { ChatGateway } from "./gateways/ChatGateway";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatEntity } from "./entities/chat.entity.";
import { UsersService } from "src/users/services/users.service";
import { UserEntity } from "src/users/entity/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ChatEntity, UserEntity])],
    providers: [ChatGateway, ChatService, UsersService],
    controllers: [ChatController],
})
export class ChatModule {}
