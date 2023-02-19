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
    addAdminDTO,
    channelDTO,
    channelPasswordDTO,
    messageDTO,
    updateChannelDTO,
    usernameDTO,
} from "../dtos/channelId.dto";
import { UsersService } from "src/users/services/users.service";

@Controller("chat")
export class ChatController {
    constructor(
        private chatService: ChatService,
        private userService: UsersService
    ) {}

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
    async directMessage(@Req() req, @Body() friend: usernameDTO) {
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
    }

    @Post("updateChannel")
    @UseGuards(isLogged)
    async updateChannelPassword(@Req() req, @Body() channel: updateChannelDTO) {
        let user = await this.userService.getByID(req.user.uuid);
        let targetChannel = await this.chatService.getByName(
            channel.channelName
        );
        if (!user || !targetChannel) {
            throw new UnauthorizedException();
        }
        if (
            this.chatService.checkPermission(
                req.user.uuid,
                "owner_only",
                targetChannel
            ) === "Unauthorized"
        ) {
            throw new UnauthorizedException();
        }
        return this.chatService.upodateChannelPassword(targetChannel, channel);
    }

    @Post("admin/add")
    @UseGuards(isLogged)
    async add_admin(@Req() req, @Body() channel: addAdminDTO) {
        let user = await this.userService.getByID(req.user.uuid);
        if (!user) {
            throw new HttpException("Who are you ?", HttpStatus.FOUND);
        }
        let newAdmin = await this.userService.getByUsername(
            channel.newAdminUsername
        );
        if (!newAdmin) {
            throw new HttpException("User not found", HttpStatus.FOUND);
        }
        let targetChannel = await this.chatService.getByName(
            channel.channelName
        );
        if (!targetChannel) {
            throw new HttpException("Invalid channel", HttpStatus.FOUND);
        }
        if (
            this.chatService.checkPermission(
                req.user.uuid,
                "owner_only",
                targetChannel
            ) === "Unauthorized"
        ) {
            throw new UnauthorizedException();
        }
        return this.chatService.addAdmin(
            targetChannel,
            newAdmin.uuid,
            user.uuid
        );
    }

    @Post("admin/remove")
    @UseGuards(isLogged)
    async remove_admin(@Req() req, @Body() channel: addAdminDTO) {
        let user = await this.userService.getByID(req.user.uuid);
        if (!user) {
            throw new HttpException("Who are you ?", HttpStatus.FOUND);
        }
        let newAdmin = await this.userService.getByUsername(
            channel.newAdminUsername
        );
        if (!newAdmin) {
            throw new HttpException("User not found", HttpStatus.FOUND);
        }
        let targetChannel = await this.chatService.getByName(
            channel.channelName
        );
        if (!targetChannel) {
            throw new HttpException("Invalid channel", HttpStatus.FOUND);
        }
        if (
            this.chatService.checkPermission(
                req.user.uuid,
                "owner_only",
                targetChannel
            ) === "Unauthorized"
        ) {
            throw new UnauthorizedException();
        }
        return this.chatService.removeAdmin(
            targetChannel,
            newAdmin.uuid,
            user.uuid
        );
    }
}
