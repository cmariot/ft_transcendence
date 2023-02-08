import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { isLogged } from "src/auth/guards/authentification.guards";
import { NewChannelDTO } from "../dtos/newChannel.dto";
import { ChatService } from "../services/chat.service";

@Controller("chat")
export class ChatController {
    constructor(private chatService: ChatService) {}

    @Post("create-channel")
    @UseGuards(isLogged)
    create_channel(@Req() req, @Body() newChannel: NewChannelDTO) {
        console.log("Create_channel : ", newChannel);
        return this.chatService.create_channel(newChannel, req.user.uuid);
    }
}
