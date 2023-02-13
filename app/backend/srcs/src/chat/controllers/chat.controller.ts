import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    UnauthorizedException,
    UseGuards,
} from "@nestjs/common";
import { isLogged } from "src/auth/guards/authentification.guards";
import {
    PrivateChannelDTO,
    ProtectedChannelDTO,
    PublicChannelDTO,
} from "../dtos/newChannel.dto";
import { ChatService } from "../services/chat.service";
import { ChannelType, ChatEntity } from "../entities/chat.entity.";
import {
    channelDTO,
    channelPasswordDTO,
    messageDTO,
} from "../dtos/channelId.dto";

@Controller("chat")
export class ChatController {
    constructor(private chatService: ChatService) {}

    @Get("channels")
    @UseGuards(isLogged)
    async get_channels(@Req() req) {
        const channels: ChatEntity[] = await this.chatService.get_channels(
            req.user.uuid
        );
        if (channels.length === 0) {
            await this.chatService.create_general_channel();
            return await this.chatService.get_channels(req.user.uuid);
        }
        return channels;
    }

    @Post("create/public")
    @UseGuards(isLogged)
    create_public_channel(@Req() req, @Body() newChannel: PublicChannelDTO) {
        if (newChannel.channelType !== ChannelType.PUBLIC) {
            throw new UnauthorizedException();
        }
        return this.chatService.create_channel(newChannel, req.user.uuid);
    }

    @Post("create/private")
    @UseGuards(isLogged)
    create_private_channel(@Req() req, @Body() newChannel: PrivateChannelDTO) {
        if (newChannel.channelType !== ChannelType.PRIVATE) {
            throw new UnauthorizedException();
        }
        return this.chatService.create_channel(newChannel, req.user.uuid);
    }

    @Post("create/protected")
    @UseGuards(isLogged)
    create_protected_channel(
        @Req() req,
        @Body() newChannel: ProtectedChannelDTO
    ) {
        if (newChannel.channelType !== ChannelType.PROTECTED) {
            throw new UnauthorizedException();
        }
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

    @Post()
    @UseGuards(isLogged)
    async send_message(@Req() req, @Body() message: messageDTO) {
        return await this.chatService.send_message(
            message.channelName,
            req.user.uuid,
            message.message
        );
    }

    @Post("join/protected")
    @UseGuards(isLogged)
    async join_protected_channel(
        @Req() req,
        @Body() channel: channelPasswordDTO
    ) {
        return await this.chatService.join_protected_channel(
            channel.channelName,
            channel.channelPassword,
            req.user.uuid
        );
    }
}
