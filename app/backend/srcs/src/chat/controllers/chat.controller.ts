import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { isLogged } from "src/auth/guards/authentification.guards";
import {
    PrivateChannelDTO,
    ProtectedChannelDTO,
    PublicChannelDTO,
} from "../dtos/newChannel.dto";
import { ChatService } from "../services/chat.service";
import { ChatEntity } from "../entities/chat.entity.";
import { channelDTO, messageDTO } from "../dtos/channelId.dto";

@Controller("chat")
export class ChatController {
    constructor(private chatService: ChatService) {}

    @Get("channels")
    @UseGuards(isLogged)
    async get_channels() {
        const channels: ChatEntity[] = await this.chatService.get_channels();
        if (channels.length === 0) {
            await this.chatService.create_general_channel();
            return await this.chatService.get_channels();
        }
        return channels;
    }

    @Post("create/public")
    @UseGuards(isLogged)
    create_public_channel(@Req() req, @Body() newChannel: PublicChannelDTO) {
        return this.chatService.create_channel(newChannel, req.user.uuid);
    }

    @Post("create/private")
    @UseGuards(isLogged)
    create_private_channel(@Req() req, @Body() newChannel: PrivateChannelDTO) {
        return this.chatService.create_channel(newChannel, req.user.uuid);
    }

    @Post("create/protected")
    @UseGuards(isLogged)
    create_protected_channel(
        @Req() req,
        @Body() newChannel: ProtectedChannelDTO
    ) {
        return this.chatService.create_channel(newChannel, req.user.uuid);
    }

    @Post("connect")
    @UseGuards(isLogged)
    channel_connection(@Req() req, @Body() channel: channelDTO) {
        return this.chatService.join_channel(
            channel.channelName,
            req.user.uuid
        );
    }

    @Post("public")
    @UseGuards(isLogged)
    async send_public_message(@Req() req, @Body() message: messageDTO) {
        return await this.chatService.send_public_message(
            message.channelName,
            req.user.uuid,
            message.message
        );
    }
}
