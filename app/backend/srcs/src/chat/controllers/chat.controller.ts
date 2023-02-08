import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { isLogged } from "src/auth/guards/authentification.guards";
import { NewChannelDTO } from "../dtos/newChannel.dto";
import { ChatService } from "../services/chat.service";
import { ChatEntity } from "../entities/chat.entity.";

@Controller("chat")
export class ChatController {
    constructor(private chatService: ChatService) {}

    @Get("channels")
    @UseGuards(isLogged)
    async get_channels(@Req() req) {
        const channels: ChatEntity[] = await this.chatService.get_channels();
        if (channels.length === 0) {
            const generalChannel: NewChannelDTO = {
                channelName: "General",
                channelOwner: req.user.uuid,
            };
            await this.chatService.create_channel(
                generalChannel,
                req.user.uuid
            );
            return await this.chatService.get_channels();
        }
        return channels;
    }

    @Post("create-channel")
    @UseGuards(isLogged)
    create_channel(@Req() req, @Body() newChannel: NewChannelDTO) {
        return this.chatService.create_channel(newChannel, req.user.uuid);
    }
}
