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
    PrivateMessageDTO,
    ProtectedChannelDTO,
    PublicChannelDTO,
} from "../dtos/newChannel.dto";
import { ChatService } from "../services/chat.service";
import { ChannelType } from "../entities/chat.entity";
import {
    addAdminDTO,
    channelDTO,
    channelPasswordDTO,
    messageDTO,
    updateChannelDTO,
    usernameDTO,
} from "../dtos/channelId.dto";
import { UsersService } from "src/users/services/users.service";
import {
    AddOptionsDTO,
    kickOptionsDTO,
    muteOptionsDTO,
} from "../dtos/admin.dto";

@Controller("chat")
export class ChatController {
    constructor(
        private chatService: ChatService,
        private userService: UsersService
    ) {}

    // Get the user's channels
    @Get("channels")
    @UseGuards(isLogged)
    async get_channels(@Req() req) {
        return await this.chatService.get_channels(req.user.uuid);
    }

    // Create a public channel
    @Post("create/public")
    @UseGuards(isLogged)
    async create_public_channel(
        @Req() req,
        @Body() newChannel: PublicChannelDTO
    ) {
        if (newChannel.channelType !== ChannelType.PUBLIC) {
            throw new UnauthorizedException();
        }
        return this.chatService.create_channel(newChannel, req.user.uuid);
    }

    // Create a protected channel
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

    // Create a private channel
    @Post("create/private")
    @UseGuards(isLogged)
    async create_private_channel(
        @Req() req,
        @Body() newChannel: PrivateChannelDTO
    ) {
        if (newChannel.channelType !== ChannelType.PRIVATE) {
            throw new UnauthorizedException();
        }
        let result = await this.chatService.create_channel(
            newChannel,
            req.user.uuid
        );
        return result;
    }

    // Create a direct-message channel
    @Post("create/direct_message")
    @UseGuards(isLogged)
    async create_private_conv(
        @Req() req,
        @Body() newChannel: PrivateMessageDTO
    ) {
        if (newChannel.channelType !== ChannelType.DIRECT_MESSAGE) {
            throw new UnauthorizedException();
        }
        return this.chatService.create_channel(newChannel, req.user.uuid);
    }

    // Join a channel
    @Post("connect")
    @UseGuards(isLogged)
    channel_connection(@Req() req, @Body() channel: channelDTO) {
        return this.chatService.join_channel(
            channel.channelName,
            req.user.uuid
        );
    }

    // Leave a channel
    @Post("leave")
    @UseGuards(isLogged)
    leave_channel(@Req() req, @Body() channel: channelDTO) {
        return this.chatService.leave_channel(
            channel.channelName,
            req.user.uuid
        );
    }

    // Send a message in the channel
    @Post()
    @UseGuards(isLogged)
    async send_message(@Req() req, @Body() message: messageDTO) {
        return await this.chatService.send_message(
            message.channelName,
            req.user.uuid,
            message.message
        );
    }

    @Post("private/add-user")
    @UseGuards(isLogged)
    async add_private_channel(@Req() req, @Body() user: AddOptionsDTO) {
        return await this.chatService.addUserInPrivate(user, req.user.uuid);
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
        return this.chatService.updateChannelPassword(targetChannel, channel);
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

    // ban
    @Post("ban")
    @UseGuards(isLogged)
    async ban_user(@Req() req, @Body() muteOptions: muteOptionsDTO) {
        let user = await this.userService.getByID(req.user.uuid);
        if (!user) {
            throw new HttpException("Who are you ?", HttpStatus.FOUND);
        }
        let mutedUser = await this.userService.getByUsername(
            muteOptions.username
        );
        if (!mutedUser) {
            throw new HttpException("User not found", HttpStatus.FOUND);
        }
        let targetChannel = await this.chatService.getByName(
            muteOptions.channelName
        );
        if (!targetChannel) {
            throw new HttpException("Invalid channel", HttpStatus.FOUND);
        }
        if (
            this.chatService.checkPermission(
                req.user.uuid,
                "owner_and_admins",
                targetChannel
            ) === "Unauthorized"
        ) {
            throw new UnauthorizedException("You are not authorized");
        }
        if (mutedUser.uuid === targetChannel.channelOwner) {
            throw new UnauthorizedException("You cannot ban this user.");
        }
        if (mutedUser.uuid === req.user.uuid) {
            throw new UnauthorizedException("You cannot ban yourself.");
        }
        return this.chatService.ban(
            user,
            mutedUser,
            targetChannel,
            muteOptions
        );
    }

    @Post("kick")
    @UseGuards(isLogged)
    async kick_user(@Req() req, @Body() options: kickOptionsDTO) {
        let user = await this.userService.getByID(req.user.uuid);
        if (!user) {
            throw new HttpException("Who are you ?", HttpStatus.FOUND);
        }
        let kickedUser = await this.userService.getByUsername(options.username);
        if (!kickedUser) {
            throw new HttpException("User not found", HttpStatus.FOUND);
        }
        let targetChannel = await this.chatService.getByName(
            options.channelName
        );
        if (!targetChannel) {
            throw new HttpException("Invalid channel", HttpStatus.FOUND);
        }
        if (
            this.chatService.checkPermission(
                req.user.uuid,
                "owner_and_admins",
                targetChannel
            ) === "Unauthorized"
        ) {
            throw new UnauthorizedException("You are not authorized");
        }
        if (kickedUser.uuid === targetChannel.channelOwner) {
            throw new UnauthorizedException("You cannot kick this user.");
        }
        if (kickedUser.uuid === req.user.uuid) {
            throw new UnauthorizedException("You cannot kick yourself.");
        }
        return this.chatService.kick(user, kickedUser, targetChannel);
    }

    // unban
    @Post("unban")
    @UseGuards(isLogged)
    async unban_user(@Req() req, @Body() muteOptions: muteOptionsDTO) {
        let user = await this.userService.getByID(req.user.uuid);
        if (!user) {
            throw new HttpException("Who are you ?", HttpStatus.FOUND);
        }
        let mutedUser = await this.userService.getByUsername(
            muteOptions.username
        );
        if (!mutedUser) {
            throw new HttpException("User not found", HttpStatus.FOUND);
        }
        let targetChannel = await this.chatService.getByName(
            muteOptions.channelName
        );
        if (!targetChannel) {
            throw new HttpException("Invalid channel", HttpStatus.FOUND);
        }
        if (
            this.chatService.checkPermission(
                req.user.uuid,
                "owner_and_admins",
                targetChannel
            ) === "Unauthorized"
        ) {
            throw new UnauthorizedException("You are not authorized");
        }
        if (mutedUser.uuid === targetChannel.channelOwner) {
            throw new UnauthorizedException("You cannot unban this user.");
        }
        if (mutedUser.uuid === req.user.uuid) {
            throw new UnauthorizedException("You cannot unban yourself.");
        }
        let list = await this.chatService.unban(mutedUser, targetChannel);
        if (!list) {
            throw new HttpException(
                "This user wasn't banned",
                HttpStatus.FOUND
            );
        }
        return list;
    }

    // mute
    @Post("mute")
    @UseGuards(isLogged)
    async mute_user(@Req() req, @Body() muteOptions: muteOptionsDTO) {
        let user = await this.userService.getByID(req.user.uuid);
        if (!user) {
            throw new HttpException("Who are you ?", HttpStatus.FOUND);
        }
        let mutedUser = await this.userService.getByUsername(
            muteOptions.username
        );
        if (!mutedUser) {
            throw new HttpException("User not found", HttpStatus.FOUND);
        }
        let targetChannel = await this.chatService.getByName(
            muteOptions.channelName
        );
        if (!targetChannel) {
            throw new HttpException("Invalid channel", HttpStatus.FOUND);
        }
        if (
            this.chatService.checkPermission(
                req.user.uuid,
                "owner_and_admins",
                targetChannel
            ) === "Unauthorized"
        ) {
            throw new UnauthorizedException("You are not authorized");
        }
        if (mutedUser.uuid === targetChannel.channelOwner) {
            throw new UnauthorizedException("You cannot mute this user.");
        }
        if (mutedUser.uuid === req.user.uuid) {
            throw new UnauthorizedException("You cannot mute yourself.");
        }
        return this.chatService.mute(mutedUser, targetChannel, muteOptions);
    }

    // unmute
    @Post("unmute")
    @UseGuards(isLogged)
    async unmute_user(@Req() req, @Body() muteOptions: muteOptionsDTO) {
        let user = await this.userService.getByID(req.user.uuid);
        if (!user) {
            throw new HttpException("Who are you ?", HttpStatus.FOUND);
        }
        let mutedUser = await this.userService.getByUsername(
            muteOptions.username
        );
        if (!mutedUser) {
            throw new HttpException("User not found", HttpStatus.FOUND);
        }
        let targetChannel = await this.chatService.getByName(
            muteOptions.channelName
        );
        if (!targetChannel) {
            throw new HttpException("Invalid channel", HttpStatus.FOUND);
        }
        if (
            this.chatService.checkPermission(
                req.user.uuid,
                "owner_and_admins",
                targetChannel
            ) === "Unauthorized"
        ) {
            throw new UnauthorizedException("You are not authorized");
        }
        if (mutedUser.uuid === targetChannel.channelOwner) {
            throw new UnauthorizedException("You cannot unmute this user.");
        }
        if (mutedUser.uuid === req.user.uuid) {
            throw new UnauthorizedException("You cannot unmute yourself.");
        }
        let list = await this.chatService.unmute(mutedUser, targetChannel);
        if (!list) {
            throw new HttpException("This user wasn't muted", HttpStatus.FOUND);
        }
        return list;
    }

    @Post("messages")
    @UseGuards(isLogged)
    async getMessages(@Req() req, @Body() channel: channelDTO) {
        return await this.chatService.getMessages(
            channel.channelName,
            req.user.uuid
        );
    }

    @Post("/private/get_users")
    @UseGuards(isLogged)
    async get_private_channel_users(@Req() req, @Body() channel: channelDTO) {
        return await this.chatService.private_channel_users(
            req.user.uuid,
            channel.channelName
        );
    }
}
