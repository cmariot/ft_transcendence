import { Module } from "@nestjs/common";
import { ChatController } from "./controllers/chat.controller";
import { ChatService } from "./services/chat.service";
import { ChatGateway } from "./gateways/ChatGateway";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatEntity } from "./entities/chat.entity.";

@Module({
    imports: [TypeOrmModule.forFeature([ChatEntity])],
    providers: [ChatGateway, ChatService],
    controllers: [ChatController],
})
export class ChatModule {}