import { Module } from "@nestjs/common";
import { ChatController } from "./controllers/chat.controller";
import { ChatService } from "./services/chat.service";
import { ChatGateway } from "./gateways/ChatGateway";
<<<<<<< HEAD
import { SocketService } from "./services/socket.service";
import { UsersService } from "src/users/services/users.service";
import { UsersModule } from "src/users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../users/entity/user.entity";


@Module({
	imports: [UsersModule, TypeOrmModule.forFeature([UserEntity])],
    providers: [SocketService, ChatGateway, ChatService, UsersService],
=======
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatEntity } from "./entities/chat.entity.";

@Module({
    imports: [TypeOrmModule.forFeature([ChatEntity])],
    providers: [ChatGateway, ChatService],
>>>>>>> 68f5bd4c548d3da9f3202504c8f62258c7331607
    controllers: [ChatController],
})
export class ChatModule {}
