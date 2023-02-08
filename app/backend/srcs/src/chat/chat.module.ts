import { Module } from "@nestjs/common";
import { ChatController } from "./controllers/chat.controller";
import { ChatService } from "./services/chat.service";
import { ChatGateway } from "./gateways/ChatGateway";

@Module({
    providers: [ChatGateway, ChatService],
    controllers: [ChatController],
})
export class ChatModule {}
