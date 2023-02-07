import { Module } from "@nestjs/common";
import { ChatGateway } from "./ChatGateway";

@Module({
    providers: [ChatGateway],
})
export class ChatModule {}
