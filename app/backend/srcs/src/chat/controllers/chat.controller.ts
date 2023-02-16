import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
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
    conversationDTO,
    messageDTO,
} from "../dtos/channelId.dto";

@Controller("chat")
export class ChatController {
    constructor(private chatService: ChatService) {}

    @Get("channels")
    @UseGuards(isLogged)
    async get_channels(@Req() req) {
        return await this.chatService.get_channels(req.user.uuid);
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

    @Post("leave")
    @UseGuards(isLogged)
    leave_channel(@Req() req, @Body() channel: channelDTO) {
        return this.chatService.leave_channel(
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

    @Post("direct-message")
    @UseGuards(isLogged)
    async directMessage(@Req() req, @Body() friend: conversationDTO) {
        let privateconv = await this.chatService.getConversationWith(
            friend.username,
            req.user.uuid
        );
        if (privateconv != null) {
            return privateconv;
        }

        throw new HttpException(
            "Please create a new private conversation",
            HttpStatus.NO_CONTENT
        );

        console.log("Pas de conv trouvee, creation !");
        let newChannel: PrivateChannelDTO = {
            channelName: "private conversation",
            channelType: "private",
            channelOwner: req.user.uuid,
            allowed_users: [friend.username],
        };
        return this.chatService.create_channel(newChannel, req.user.uuid);
    }
}
