import {
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChannelType, ChatEntity } from "../entities/chat.entity";
import { Repository } from "typeorm";
import { ChatGateway } from "../../sockets/gateways/chat.gateway";
import * as bcrypt from "bcrypt";
import { UsersService } from "src/users/services/users.service";
import { updateChannelDTO } from "../dtos/channelId.dto";
import { UserEntity } from "src/users/entity/user.entity";
import { AddOptionsDTO, muteOptionsDTO } from "../dtos/admin.dto";

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatEntity)
        private chatRepository: Repository<ChatEntity>,
        private chatGateway: ChatGateway,
        private userService: UsersService
    ) {}

    // Get a channel by it's channelName
    async getByName(channelName: string) {
        return await this.chatRepository.findOneBy({
            channelName: channelName,
        });
    }

    // Get all the accessibles channels for an user
    async get_channels(uuid: string) {
        let user = await this.userService.getByID(uuid);
        if (!user) {
            throw new UnauthorizedException("Invalid user");
        }
        let channels = await this.chatRepository.find();
        if (!channels || channels.length === 0) {
            const general = await this.create_general_channel();
            channels.push(general);
        }
        let userChannels: ChatEntity[] = [];
        let userPrivateChannels: ChatEntity[] = [];
        let availableChannels: ChatEntity[] = [];
        let i = 0;
        while (i < channels.length) {
            if (
                channels[i].channelType === ChannelType.PUBLIC ||
                channels[i].channelType === ChannelType.PROTECTED
            ) {
                if (channels[i].channelOwner === user.uuid) {
                    userChannels.push(channels[i]);
                } else {
                    let has_joined = false;
                    let is_ban = false;
                    let j = 0;
                    while (j < channels[i].users.length) {
                        if (channels[i].users[j].uuid === user.uuid) {
                            if (
                                channels[i].banned_users.findIndex(
                                    (user) => user.uuid === user.uuid
                                ) === -1
                            ) {
                                has_joined = true;
                                userChannels.push(channels[i]);
                            } else {
                                is_ban = true;
                            }
                            break;
                        }
                        j++;
                    }
                    if (!has_joined && !is_ban) {
                        availableChannels.push(channels[i]);
                    } else {
                        has_joined = false;
                        is_ban = false;
                    }
                }
            } else if (
                channels[i].channelType === ChannelType.PRIVATE ||
                channels[i].channelType === ChannelType.DIRECT_MESSAGE
            ) {
                let j = 0;
                while (j < channels[i].allowed_users.length) {
                    if (channels[i].allowed_users[j].uuid === user.uuid) {
                        if (
                            channels[i].banned_users.findIndex(
                                (user) => user.uuid === user.uuid
                            ) === -1
                        ) {
                            if (
                                user.blocked.findIndex(
                                    (blocked) =>
                                        blocked === channels[i].channelOwner
                                ) === -1
                            ) {
                                userPrivateChannels.push(channels[i]);
                            }
                        }
                        break;
                    }
                    j++;
                }
            }
            i++;
        }
        return {
            userChannels: userChannels,
            userPrivateChannels: userPrivateChannels,
            availableChannels: availableChannels,
        };
    }

    // Create a default channel
    async create_general_channel(): Promise<ChatEntity> {
        const generalChannel: any = {
            channelName: "General",
            channelType: "public",
            channelOwner: "0",
        };
        const general = await this.chatRepository.save(generalChannel);
        if (general) return general;
        throw new HttpException(
            "Error, impossible to create the general channel",
            HttpStatus.FAILED_DEPENDENCY
        );
    }

    // Create a channel
    async create_channel(channel: any, uuid: string) {
        let user = await this.userService.getByID(uuid);
        if (!user) {
            throw new UnauthorizedException("Invalid user");
        }
        if (
            await this.chatRepository.findOneBy({
                channelName: channel.channelName,
            })
        ) {
            throw new HttpException(
                "Unavailable channel name",
                HttpStatus.FOUND
            );
        }
        channel.channelOwner = uuid;
        if (
            channel.channelType === ChannelType.PUBLIC ||
            channel.channelType === ChannelType.PROTECTED
        ) {
            channel.users = [{ uuid: uuid }];
            if (channel.channelType === ChannelType.PROTECTED) {
                channel.channelPassword = await this.encode_password(
                    channel.channelPassword
                );
            }
            channel = await this.chatRepository.save(channel);
            if (channel) {
                this.chatGateway.newChannelAvailable(channel.channel);
                this.chatGateway.userJoinChannel(
                    channel.channelName,
                    user.username
                );
                return this.convertChannelMessages(
                    uuid,
                    channel.messages,
                    channel
                );
            }
        } else if (channel.channelType === ChannelType.PRIVATE) {
            channel.allowed_users = [{ uuid: channel.channelOwner }];
            channel = await this.chatRepository.save(channel);
            if (channel) {
                this.chatGateway.newChannelAvailable(channel.channelName);
                this.chatGateway.userJoinChannel(
                    channel.channelName,
                    user.username
                );
                return await this.convertChannelMessages(
                    uuid,
                    channel.messages,
                    channel
                );
            }
        } else if (channel.channelType === ChannelType.DIRECT_MESSAGE) {
            let allowed_user: { uuid: string }[] = [
                { uuid: channel.channelOwner },
            ];
            if (channel.allowed_users.length !== 1) {
                throw new UnauthorizedException("DM must be with one person.");
            }
            let friend = await this.userService.getByUsername(
                channel.allowed_users[0]
            );
            if (friend) {
                allowed_user.push({ uuid: friend.uuid });
            }
            channel.allowed_users = allowed_user;
            channel = await this.chatRepository.save(channel);
            if (channel) {
                this.chatGateway.newChannelAvailable(channel.channelName);
                this.chatGateway.userJoinChannel(
                    channel.channelName,
                    user.username
                );
                return await this.convertChannelMessages(
                    uuid,
                    channel.messages,
                    channel
                );
            }
        }
        throw new UnauthorizedException("Invalid channel.");
    }

    // Encode the password for the protected channels
    async encode_password(rawPassword: string): Promise<string> {
        const saltRounds: number = 11;
        const salt = bcrypt.genSaltSync(saltRounds);
        return bcrypt.hashSync(rawPassword, salt);
    }

    // Join a channel
    async join_channel(channelName: string, userID: string) {
        let channels = await this.chatRepository.find();
        if (channels.length === 0) {
            this.create_general_channel();
        }
        let channel = await this.chatRepository.findOneBy({
            channelName: channelName,
        });
        if (!channel) throw new UnauthorizedException();
        var user: UserEntity | null = await this.userService.getByID(userID);
        if (!user) {
            throw new UnauthorizedException("User not found");
        }

        // Check if banned
        if (channel.banned_users) {
            let i = 0;
            while (i < channel.banned_users.length) {
                if (channel.banned_users[i].uuid === user.uuid) {
                    let now = Date.now();
                    if (parseInt(channel.banned_users[i].ban_duration) === 0) {
                        // perm ban
                        throw new UnauthorizedException(
                            "You are not allowed to join this channel."
                        );
                    } else if (
                        now - parseInt(channel.banned_users[i].ban_date) <
                        parseInt(channel.banned_users[i].ban_duration) * 1000
                    ) {
                        throw new UnauthorizedException(
                            "You are not allowed to join this channel."
                        );
                    } else {
                        let banned = channel.banned_users;
                        banned.splice(i, 1);
                        await this.chatRepository.update(
                            { uuid: channel.uuid },
                            { banned_users: banned }
                        );
                    }
                    break;
                }
                i++;
            }
        }

        if (
            channel.channelType === ChannelType.DIRECT_MESSAGE ||
            channel.channelType === ChannelType.PRIVATE
        ) {
            let index_in_authorized_channels = channels.findIndex(
                (element) => element.channelName === channelName
            );
            if (index_in_authorized_channels !== -1) {
                channel = channels[index_in_authorized_channels];
                let allowed_user = channel.allowed_users.findIndex(
                    (element) => element.uuid === userID
                );
                if (allowed_user === -1) {
                    throw new HttpException(
                        "Unauthorized.",
                        HttpStatus.UNAUTHORIZED
                    );
                }
                this.chatGateway.userJoinChannel(
                    channel.channelName,
                    user.username
                );
                return this.convertChannelMessages(
                    userID,
                    channels[index_in_authorized_channels].messages,
                    channels[index_in_authorized_channels]
                );
            }
        } else if (channel.channelType === ChannelType.PUBLIC) {
            let channel_users = channel.users;
            let i = 0;
            let found = false;
            while (i < channel_users.length) {
                if (channel_users[i].uuid === user.uuid) {
                    found = true;
                    break;
                }
                i++;
            }
            if (found === false) {
                channel_users.push({ uuid: user.uuid });
                this.chatRepository.update(
                    { channelName: channel.channelName },
                    { users: channel_users }
                );
            }
            await this.chatGateway.userJoinChannel(
                channel.channelName,
                user.username
            );
            return this.convertChannelMessages(
                user.uuid,
                channel.messages,
                channel
            );
        } else if (channel.channelType === ChannelType.PROTECTED) {
            let allowed_users = channel.users;
            let i = 0;

            while (i < allowed_users.length) {
                if (allowed_users[i].uuid === user.uuid) {
                    this.chatGateway.userJoinChannel(
                        channel.channelName,
                        user.username
                    );
                    return this.convertChannelMessages(
                        user.uuid,
                        channel.messages,
                        channel
                    );
                }
                i++;
            }
            throw new HttpException(
                "Enter the channel's password",
                HttpStatus.FOUND
            );
        }
        throw new UnauthorizedException();
    }

    // Check if password match for a protected channel
    async join_protected_channel(
        channelName: string,
        channelPassword: string,
        uuid: string
    ) {
        let channel = await this.chatRepository.findOneBy({
            channelName: channelName,
        });
        if (!channel) throw new UnauthorizedException("Invalid channel");
        if (channel.channelType === ChannelType.PUBLIC) {
            return this.join_channel(channelName, uuid);
        } else if (channel.channelType !== ChannelType.PROTECTED) {
            throw new UnauthorizedException("Invalid channel");
        }
        let user = await this.userService.getByID(uuid);
        if (!user) throw new UnauthorizedException("Invalid user");
        const isMatch = await bcrypt.compare(
            channelPassword,
            channel.channelPassword
        );
        if (!isMatch) throw new UnauthorizedException("Invalid password");
        let channel_users = channel.users;
        let i = 0;
        let found = false;
        while (i < channel_users.length) {
            if (channel_users[i].uuid === user.uuid) {
                found = true;
                break;
            }
            i++;
        }
        if (found === false) {
            channel_users.push({ uuid: user.uuid });
            await this.chatRepository.update(
                { channelName: channel.channelName },
                { users: channel_users }
            );
        }
        return this.join_channel(channelName, uuid);
    }

    // Get messages, and other channel informations when join it
    async convertChannelMessages(
        uuid: string,
        initial_messages: { uuid: string; message: string }[],
        channel: ChatEntity
    ) {
        let user = await this.userService.getByID(uuid);
        if (!user) {
            throw new UnauthorizedException();
        }
        let blocked_users = user.blocked;
        let banned_users = channel.banned_users;
        let returned_messages: { username: string; message: string }[] = [];
        let i = 0;
        while (i < initial_messages.length) {
            if (blocked_users.indexOf(initial_messages[i].uuid) === -1) {
                let chat_user = await this.userService.getByID(
                    initial_messages[i].uuid
                );
                if (chat_user) {
                    let j = 0;
                    let found = false;
                    while (j < banned_users.length) {
                        if (banned_users[j].uuid === initial_messages[i].uuid) {
                            found = true;
                            break;
                        }
                        j++;
                    }
                    if (found === true) {
                        found = false;
                        returned_messages.push({
                            username: chat_user.username,
                            message: "deleted message",
                        });
                    } else {
                        returned_messages.push({
                            username: chat_user.username,
                            message: initial_messages[i].message,
                        });
                    }
                }
            }
            i++;
        }
        let owner: boolean = false;
        let admin: boolean = false;
        let admins: string[] = [];
        if (user.uuid === channel.channelOwner) {
            owner = true;
            admin = true;
            let i = 0;
            while (i < channel.channelAdministrators.length) {
                let id = channel.channelAdministrators[i].uuid;
                let user = await this.userService.getByID(id);
                if (user) {
                    admins.push(user.username);
                }
                i++;
            }
        }
        if (owner === false && channel.channelAdministrators) {
            let i = 0;
            while (i < channel.channelAdministrators.length) {
                if (user.uuid === channel.channelAdministrators[i].uuid) {
                    admin = true;
                    break;
                }
                i++;
            }
        }
        let banned_users_list: string[] = [];
        let muted_users_list: string[] = [];
        let private_users_list: string[] = [];
        if (admin === true) {
            if (channel.mutted_users) {
                let i = 0;
                while (i < channel.mutted_users.length) {
                    let username = await this.userService.getUsernameById(
                        channel.mutted_users[i].uuid
                    );
                    if (username) {
                        muted_users_list.push(username);
                    }
                    i++;
                }
            }
            if (channel.banned_users) {
                let i = 0;
                while (i < channel.banned_users.length) {
                    let username = await this.userService.getUsernameById(
                        channel.banned_users[i].uuid
                    );
                    if (username) {
                        banned_users_list.push(username);
                    }
                    i++;
                }
            }

            if (
                channel.channelType === ChannelType.PRIVATE &&
                channel.allowed_users
            ) {
                let i = 0;
                while (i < channel.allowed_users.length) {
                    if (channel.allowed_users[i].uuid !== uuid) {
                        let username = await this.userService.getUsernameById(
                            channel.allowed_users[i].uuid
                        );
                        if (username) {
                            private_users_list.push(username);
                        }
                    }
                    i++;
                }
            }
        }
        return {
            messages: returned_messages,
            channel_owner: owner,
            channel_admin: admin,
            channel_admins: admins,
            banned_users: banned_users_list,
            muted_users: muted_users_list,
            private_channel_users: private_users_list,
        };
    }

    async channelTypeUpdate(channel: ChatEntity, newType: string) {
        for (let i = 0; i < channel.users.length; i++) {
            let user = await this.userService.getByID(channel.users[i].uuid);
            if (user && user.socketId.length > 0) {
                this.chatGateway.channelTypeChanged(user.socketId, {
                    channelName: channel.channelName,
                    channelType: newType,
                });
            }
        }
    }

    // Set a channel password / change it or remove it
    async updateChannelPassword(
        targetChannel: ChatEntity,
        channel: updateChannelDTO
    ) {
        if (
            targetChannel.channelType === "public" &&
            channel.newChannelType === true
        ) {
            // Change to protected and add password
            if (channel.newChannelPassword.length < 10) {
                throw new UnauthorizedException(
                    "Password must be 10 length min characters"
                );
            }
            let hashed_password = await this.encode_password(
                channel.newChannelPassword
            );
            await this.chatRepository.update(
                { uuid: targetChannel.uuid },
                {
                    channelType: ChannelType.PROTECTED,
                    channelPassword: hashed_password,
                }
            );
            await this.channelTypeUpdate(targetChannel, "protected");
        } else if (
            targetChannel.channelType === "protected" &&
            channel.newChannelType === false
        ) {
            // Change to public and remove password
            await this.chatRepository.update(
                { uuid: targetChannel.uuid },
                { channelPassword: "", channelType: ChannelType.PUBLIC }
            );
            await this.channelTypeUpdate(targetChannel, "public");
        } else if (
            targetChannel.channelType === "protected" &&
            channel.newChannelType === true
        ) {
            // Update the channel password"
            if (channel.newChannelPassword.length < 10) {
                throw new UnauthorizedException(
                    "Password must be 10 length min characters"
                );
            }
            let hashed_password = await this.encode_password(
                channel.newChannelPassword
            );
            await this.chatRepository.update(
                { uuid: targetChannel.uuid },
                { channelPassword: hashed_password }
            );
        } else {
            return;
        }
        this.chatGateway.newChannelAvailable(channel.channelName);
        return "updated";
    }

    // Leave a channel
    async leave_channel(channelName: string, uuid: string) {
        let channel = await this.chatRepository.findOneBy({
            channelName: channelName,
        });
        if (!channel) throw new UnauthorizedException("Invalid channel");
        let user = await this.userService.getByID(uuid);
        if (!user) {
            throw new UnauthorizedException("Invalid user");
        }

        if (
            channel.channelType === ChannelType.PUBLIC ||
            channel.channelType === ChannelType.PROTECTED
        ) {
            if (channel.channelOwner === uuid) {
                await this.chatGateway.leave_room(
                    channel.channelName,
                    user.socketId[0]
                );
                await this.chatRepository.delete({ uuid: channel.uuid });
                this.chatGateway.deleted_channel(
                    channel.channelName,
                    user.username
                );
            } else {
                let index = channel.users.findIndex(
                    (element) => element.uuid === uuid
                );
                if (index !== -1) {
                    await this.chatGateway.leave_room(
                        channel.channelName,
                        user.socketId[0]
                    );
                    channel.users.splice(index, 1);
                    await this.chatRepository.update(
                        { channelName: channelName },
                        { users: channel.users }
                    );
                    index = channel.channelAdministrators.findIndex(
                        (element) => element.uuid === uuid
                    );
                    if (index !== -1) {
                        channel.channelAdministrators.splice(index, 1);
                        await this.chatRepository.update(
                            { channelName: channelName },
                            {
                                channelAdministrators:
                                    channel.channelAdministrators,
                            }
                        );
                        this.chatGateway.updateChannelAdmin(
                            user.username,
                            channel.channelName,
                            false
                        );
                    }
                } else {
                    throw new UnauthorizedException();
                }
            }
        } else if (channel.channelType === ChannelType.DIRECT_MESSAGE) {
            await this.chatGateway.leave_room(
                channel.channelName,
                user.socketId[0]
            );
            await this.chatRepository.delete({ uuid: channel.uuid });
            this.chatGateway.deleted_channel(
                channel.channelName,
                user.username
            );
        } else if (channel.channelType === ChannelType.PRIVATE) {
            await this.chatGateway.leave_room(
                channel.channelName,
                user.socketId[0]
            );
            if (channel.channelOwner === uuid) {
                await this.chatRepository.delete({ uuid: channel.uuid });
                this.chatGateway.deleted_channel(
                    channel.channelName,
                    user.username
                );
            } else {
                let index = channel.allowed_users.findIndex(
                    (element) => element.uuid === uuid
                );
                if (index !== -1) {
                    channel.allowed_users.splice(index, 1);
                    await this.chatRepository.update(
                        { channelName: channelName },
                        { allowed_users: channel.allowed_users }
                    );
                    index = channel.channelAdministrators.findIndex(
                        (element) => element.uuid === uuid
                    );
                    if (index !== -1) {
                        channel.channelAdministrators.splice(index, 1);
                        await this.chatRepository.update(
                            { channelName: channelName },
                            {
                                channelAdministrators:
                                    channel.channelAdministrators,
                            }
                        );
                        this.chatGateway.updateChannelAdmin(
                            user.username,
                            channel.channelName,
                            false
                        );
                    }
                    let target_list = await this.get_Admin_Owner(channel);
                    this.chatGateway.leave_privateChannel(
                        user.username,
                        channelName,
                        target_list
                    );
                } else {
                    throw new UnauthorizedException();
                }
            }
        }
    }

    // Add a channel admin
    async addAdmin(
        channel: ChatEntity,
        newAdminUUID: string,
        ownerUUID: string
    ) {
        if (newAdminUUID === ownerUUID) {
            throw new HttpException(
                "The owner cannot be an administrator",
                HttpStatus.FOUND
            );
        }
        let found = false;
        if (
            channel.channelType === ChannelType.PUBLIC ||
            channel.channelType === ChannelType.PROTECTED
        ) {
            if (
                channel.users.find((element) => element.uuid === newAdminUUID)
            ) {
                found = true;
            }
        } else if (channel.channelType === ChannelType.PRIVATE) {
            if (
                channel.allowed_users.find(
                    (element) => element.uuid === newAdminUUID
                )
            ) {
                found = true;
            }
        }
        if (found === false) {
            throw new HttpException("Not in the Channel", HttpStatus.FOUND);
        }
        let currentAdmin = channel.channelAdministrators;
        let i = 0;
        while (i < currentAdmin.length) {
            if (newAdminUUID === currentAdmin[i].uuid) {
                throw new HttpException("Already admin", HttpStatus.FOUND);
            }
            i++;
        }
        currentAdmin.push({ uuid: newAdminUUID });
        let newAdmin = await this.userService.getByID(newAdminUUID);
        if (!newAdmin) {
            return;
        }
        await this.chatRepository.update(
            { uuid: channel.uuid },
            { channelAdministrators: currentAdmin }
        );
        this.chatGateway.updateChannelAdmin(
            newAdmin.username,
            channel.channelName,
            true
        );
    }

    // Remove a channel admin
    async removeAdmin(
        channel: ChatEntity,
        newAdminUUID: string,
        ownerUUID: string
    ) {
        if (newAdminUUID === ownerUUID) {
            throw new HttpException(
                "The owner cannot be removed from the admins",
                HttpStatus.FOUND
            );
        }
        let currentAdmin = channel.channelAdministrators;
        let i = 0;
        while (i < currentAdmin.length) {
            if (newAdminUUID === currentAdmin[i].uuid) {
                currentAdmin.splice(i, 1);
            }
            i++;
        }
        let newAdmin = await this.userService.getByID(newAdminUUID);
        if (!newAdmin) {
            return;
        }
        await this.chatRepository.update(
            { uuid: channel.uuid },
            { channelAdministrators: currentAdmin }
        );
        this.chatGateway.updateChannelAdmin(
            newAdmin.username,
            channel.channelName,
            false
        );
    }

    // Ban an user in the chat
    async ban(
        user: UserEntity,
        bannedUser: UserEntity,
        targetChannel: ChatEntity,
        banOptions: muteOptionsDTO
    ) {
        let currentBanned = targetChannel.banned_users;
        let i = 0;
        let found = false;
        while (i < currentBanned.length) {
            if (bannedUser.uuid === currentBanned[i].uuid) {
                currentBanned[i].ban_date = Date.now().toString();
                currentBanned[i].ban_duration = banOptions.duration.toString();
                found = true;
                break;
            }
            i++;
        }
        if (found === false) {
            currentBanned.push({
                uuid: bannedUser.uuid,
                ban_date: Date.now().toString(),
                ban_duration: banOptions.duration.toString(),
            });
        }
        this.removeAdmin(targetChannel, bannedUser.uuid, user.uuid);
        let updateChannel: ChatEntity | null = await this.getByName(
            targetChannel.channelName
        );
        if (!updateChannel) {
            throw new UnauthorizedException("Invalid channel");
        }
        let target_list = await this.get_Admin_Owner(updateChannel);
        await this.chatGateway.remove_admin(
            bannedUser.username,
            target_list,
            targetChannel.channelName
        );
        if (banOptions.duration > 0) {
            setTimeout(async () => {
                let banUser = await this.userService.getByID(bannedUser.uuid);
                if (banUser) {
                    await this.unban(banUser, targetChannel);
                }
            }, banOptions.duration * 1000);
        }
        await this.chatRepository.update(
            { uuid: targetChannel.uuid },
            { banned_users: currentBanned }
        );
        target_list = await this.get_Admin_Owner(targetChannel);
        this.chatGateway.ban_user(
            targetChannel.channelName,
            banOptions.username,
            target_list,
            bannedUser.socketId[0]
        );
        let ban_usernames_list: string[] = [];
        for (let j = 0; j < currentBanned.length; j++) {
            let user = await this.userService.getByID(currentBanned[j].uuid);
            if (user && user.username) {
                ban_usernames_list.push(user.username);
            }
        }
        return ban_usernames_list;
    }

    // Unban an user in a channel
    async unban(unbannedUser: UserEntity, targetChannel: ChatEntity) {
        let channel = await this.getByName(targetChannel.channelName);
        if (!channel) {
            throw new UnauthorizedException("Invalid channel");
        }
        let currentBanned = channel.banned_users;
        let i = 0;
        let found = false;
        while (i < currentBanned.length) {
            if (unbannedUser.uuid === currentBanned[i].uuid) {
                currentBanned.splice(i, 1);
                found = true;
                break;
            }
            i++;
        }
        if (found === false) {
            return null;
        }
        await this.chatRepository.update(
            { uuid: targetChannel.uuid },
            { banned_users: currentBanned }
        );
        let target_list = await this.get_Admin_Owner(targetChannel);
        this.chatGateway.unban_user(
            targetChannel.channelName,
            unbannedUser.username,
            target_list,
            unbannedUser.socketId[0]
        );
        let ban_usernames_list: string[] = [];
        for (let j = 0; j < currentBanned.length; j++) {
            let user = await this.userService.getByID(currentBanned[j].uuid);
            if (user && user.username) {
                ban_usernames_list.push(user.username);
            }
        }
        return ban_usernames_list;
    }

    async addUserInPrivate(addUser: AddOptionsDTO, uuid: string) {
        var newUser: UserEntity | null = await this.userService.getByUsername(
            addUser.username
        );
        if (!newUser) {
            throw new UnauthorizedException("Invalid user");
        }
        let channel = await this.getByName(addUser.channelName);
        if (!channel) {
            throw new UnauthorizedException("Invalid channel");
        }
        if (
            this.checkPermission(uuid, "owner_and_admins", channel) ===
            "Unauthorized"
        ) {
            throw new UnauthorizedException(
                "Not allowed to do this on this channel"
            );
        }
        var newUserUuid = newUser.uuid;
        if (
            channel.banned_users.findIndex(
                (banned) => banned.uuid === newUserUuid
            ) !== -1
        ) {
            throw new UnauthorizedException("Banned user");
        } else if (
            channel.allowed_users.findIndex(
                (allowed) => allowed.uuid === newUserUuid
            ) !== -1
        ) {
            throw new UnauthorizedException("Already allowed");
        } else {
            let allowed = channel.allowed_users;
            allowed.push({ uuid: newUserUuid });
            await this.chatRepository.update(
                { uuid: channel.uuid },
                { allowed_users: allowed }
            );
            let users_list: string[] = [];
            for (let i = 0; i < allowed.length; i++) {
                if (allowed[i].uuid !== channel.channelOwner) {
                    let user = await this.userService.getByID(allowed[i].uuid);
                    if (user && user.username) {
                        users_list.push(user.username);
                    }
                }
            }
            this.chatGateway.newChannelAvailable(channel.channelName);
            let target_list = await this.get_Admin_Owner(channel);
            this.chatGateway.addUser_privateChannel(
                addUser.username,
                addUser.channelName,
                target_list
            );
            return users_list;
        }
    }

    async send_message(channelName: string, userID: string, message: string) {
        let channel: ChatEntity | null = await this.chatRepository.findOneBy({
            channelName: channelName,
        });
        if (!channel) {
            throw new UnauthorizedException("Invalid channel");
        }

        let i = 0;
        while (i < channel.mutted_users.length) {
            if (channel.mutted_users[i].uuid === userID) {
                let now = Date.now();
                if (parseInt(channel.mutted_users[i].mute_duration) === 0) {
                    // perm mute
                    throw new UnauthorizedException(
                        "You are not allowed to send a message in this channel."
                    );
                } else if (
                    now - parseInt(channel.mutted_users[i].mute_date) <
                    parseInt(channel.mutted_users[i].mute_duration) * 1000
                ) {
                    throw new UnauthorizedException(
                        "You are not allowed to send a message in this channel."
                    );
                } else {
                    let muted = channel.mutted_users;
                    muted.splice(i, 1);
                    await this.chatRepository.update(
                        { uuid: channel.uuid },
                        { mutted_users: muted }
                    );
                }
                break;
            }
            i++;
        }
        let user = await this.userService.getByID(userID);
        if (!user) throw new UnauthorizedException("Invalid user");

        if (channel.channelType === ChannelType.PUBLIC) {
            let channelMessages = channel.messages;
            channelMessages.push({ uuid: user.uuid, message: message });
            await this.chatRepository.update(
                { uuid: channel.uuid },
                { messages: channelMessages }
            );
            return this.chatGateway.send_message(
                channel.channelName,
                user.username,
                message
            );
        } else if (channel.channelType === ChannelType.PROTECTED) {
            let allowed_users = channel.users;
            let i = 0;
            while (i < allowed_users.length) {
                if (allowed_users[i].uuid === user.uuid) {
                    let channelMessages = channel.messages;
                    channelMessages.push({
                        uuid: user.uuid,
                        message: message,
                    });
                    await this.chatRepository.update(
                        { uuid: channel.uuid },
                        { messages: channelMessages }
                    );
                    return this.chatGateway.send_message(
                        channel.channelName,
                        user.username,
                        message
                    );
                }
                i++;
            }
            throw new HttpException("Unauthorized.", HttpStatus.UNAUTHORIZED);
        } else if (
            channel.channelType === ChannelType.DIRECT_MESSAGE ||
            channel.channelType === ChannelType.PRIVATE
        ) {
            let allowed_users = channel.allowed_users;
            let i = 0;
            while (i < allowed_users.length) {
                if (allowed_users[i].uuid === user.uuid) {
                    let channelMessages = channel.messages;
                    channelMessages.push({
                        uuid: user.uuid,
                        message: message,
                    });
                    await this.chatRepository.update(
                        { uuid: channel.uuid },
                        { messages: channelMessages }
                    );
                    return this.chatGateway.send_message(
                        channel.channelName,
                        user.username,
                        message
                    );
                }
                i++;
            }
            throw new HttpException("Unauthorized.", HttpStatus.UNAUTHORIZED);
        } else {
            throw new UnauthorizedException("Invalid channel type");
        }
    }

    async getConversationWith(username: string, uuid: string) {
        let friend = await this.userService.getByUsername(username);
        if (!friend) {
            throw new UnauthorizedException("Cannot find this user");
        }
        let channels = await this.chatRepository.find();
        if (!channels) {
            return null;
        }
        let i = 0;
        while (i < channels.length) {
            if (channels[i].channelType === ChannelType.DIRECT_MESSAGE) {
                let j = 0;
                while (j < channels[i].allowed_users.length) {
                    if (channels[i].allowed_users[j].uuid === uuid) {
                        let k = 0;
                        while (k < channels[i].allowed_users.length) {
                            if (
                                channels[i].allowed_users[k].uuid ===
                                    friend.uuid &&
                                channels[i].allowed_users.length === 2
                            ) {
                                //join ici
                                let messages =
                                    await this.convertChannelMessages(
                                        uuid,
                                        channels[i].messages,
                                        channels[i]
                                    );

                                return {
                                    channelName: channels[i].channelName,
                                    data: messages,
                                };
                            }
                            k++;
                        }
                    }
                    j++;
                }
            }
            i++;
        }
        return null;
    }

    checkPermission(
        uuid: string,
        authorizationType: string,
        targetChannel: ChatEntity
    ) {
        if (uuid == targetChannel.channelOwner) {
            return "Authorized";
        }
        if (authorizationType === "owner_and_admins") {
            let i = 0;
            while (i < targetChannel.channelAdministrators.length) {
                if (uuid === targetChannel.channelAdministrators[i].uuid) {
                    return "Authorized";
                }
                i++;
            }
        }
        return "Unauthorized";
    }

    async kick(
        user: UserEntity,
        kickedUser: UserEntity,
        targetChannel: ChatEntity
    ) {
        if (
            targetChannel.channelType === ChannelType.PROTECTED ||
            targetChannel.channelType === ChannelType.PUBLIC
        ) {
            let current_users = targetChannel.users;
            for (let i = 0; i < current_users.length; i++) {
                if (current_users[i].uuid === kickedUser.uuid) {
                    await this.leave_channel(
                        targetChannel.channelName,
                        current_users[i].uuid
                    );
                    let updateChannel: ChatEntity | null = await this.getByName(
                        targetChannel.channelName
                    );
                    if (!updateChannel) {
                        throw new UnauthorizedException("Invalid channel.");
                    }
                    let target_list = await this.get_Admin_Owner(updateChannel);
                    await this.chatGateway.remove_admin(
                        kickedUser.username,
                        target_list,
                        targetChannel.channelName
                    );
                    return this.chatGateway.kick_user(
                        targetChannel.channelName,
                        kickedUser.username
                    );
                }
            }
        } else if (targetChannel.channelType === ChannelType.PRIVATE) {
            let current_users = targetChannel.allowed_users;
            let index = -1;
            for (let i = 0; i < current_users.length; i++) {
                if (current_users[i].uuid === kickedUser.uuid) {
                    index = i;
                    await this.leave_channel(
                        targetChannel.channelName,
                        current_users[i].uuid
                    );
                    this.chatGateway.kick_user(
                        targetChannel.channelName,
                        kickedUser.username
                    );
                    let users_list: string[] = [];
                    let j = 0;
                    while (j < targetChannel.allowed_users.length) {
                        if (
                            targetChannel.allowed_users[j].uuid !== user.uuid &&
                            targetChannel.allowed_users[j].uuid !==
                                kickedUser.uuid
                        ) {
                            let username =
                                await this.userService.getUsernameById(
                                    targetChannel.allowed_users[j].uuid
                                );
                            if (username) {
                                users_list.push(username);
                            }
                        }
                        j++;
                    }
                    return users_list;
                }
            }
        }
        throw new HttpException("User not found", HttpStatus.FOUND);
    }

    async get_Admin_list(channel: ChatEntity) {
        let uuidlist: string[] = [];
        let username_list: string[] = [];
        for (let i = 0; i < channel.channelAdministrators.length; i++) {
            uuidlist.push(channel.channelAdministrators[i].uuid);
        }
        if (uuidlist.length > 0) {
            for (let i = 0; i < uuidlist.length; i++) {
                username_list.push(
                    await this.userService.getUsernameById(uuidlist[i])
                );
            }
        }
        return username_list;
    }

    async get_Admin_Owner(channel: ChatEntity) {
        let target_list: string[] = new Array<string>();
        if (channel && channel.channelOwner) {
            let target_uuidList: string[] = new Array<string>();
            target_uuidList.push(channel.channelOwner);
            for (let i = 0; i < channel.channelAdministrators.length; i++) {
                target_uuidList.push(channel.channelAdministrators[i].uuid);
            }
            if (target_uuidList.length > 0) {
                target_list = [];
                for (let i = 0; i < target_uuidList.length; i++) {
                    let user = await this.userService.getByID(
                        target_uuidList[i]
                    );
                    if (user) {
                        for (let j = 0; j < user.socketId.length; j++) {
                            target_list.push(user.socketId[j]);
                        }
                    }
                }
            }
        }
        return target_list;
    }

    async timeout(
        mutedUser: UserEntity,
        targetChannel: ChatEntity,
        event: string
    ) {
        let users_list;
        if (event === "mute") {
            users_list = await this.unmute(mutedUser, targetChannel);
        }
        if (event === "unban") {
            users_list = await this.unban(mutedUser, targetChannel);
        }
    }

    async mute(
        mutedUser: UserEntity,
        targetChannel: ChatEntity,
        muteOptions: muteOptionsDTO
    ) {
        let currentMuted = targetChannel.mutted_users;
        let i = 0;
        let found = false;
        while (i < currentMuted.length) {
            if (mutedUser.uuid === currentMuted[i].uuid) {
                currentMuted[i].mute_date = Date.now().toString();
                currentMuted[i].mute_duration = muteOptions.duration.toString();
                found = true;
                break;
            }
            i++;
        }
        if (found === false) {
            currentMuted.push({
                uuid: mutedUser.uuid,
                mute_date: Date.now().toString(),
                mute_duration: muteOptions.duration.toString(),
            });
        }
        if (muteOptions.duration > 0) {
            setTimeout(() => {
                this.timeout(mutedUser, targetChannel, "mute");
            }, muteOptions.duration * 1000);
        }
        await this.chatRepository.update(
            { uuid: targetChannel.uuid },
            { mutted_users: currentMuted }
        );
        let mute_usernames_list: string[] = [];
        for (let j = 0; j < currentMuted.length; j++) {
            let user = await this.userService.getByID(currentMuted[j].uuid);
            if (user && user.username) {
                mute_usernames_list.push(user.username);
            }
        }
        let target_list = await this.get_Admin_Owner(targetChannel);
        await this.chatGateway.sendMuteUser(
            targetChannel.channelName,
            mutedUser.username,
            target_list
        );
        return mute_usernames_list;
    }

    async unmute(mutedUser: UserEntity, targetChannel: ChatEntity) {
        let channel = await this.getByName(targetChannel.channelName);
        if (!channel) {
            throw new UnauthorizedException("Invalid channel");
        }
        let currentMuted = channel.mutted_users;
        let i = 0;
        let found = false;
        while (i < currentMuted.length) {
            if (mutedUser.uuid === currentMuted[i].uuid) {
                currentMuted.splice(i, 1);
                found = true;
                break;
            }
            i++;
        }
        if (found === false) {
            return null;
        }
        await this.chatRepository.update(
            { uuid: targetChannel.uuid },
            { mutted_users: currentMuted }
        );
        let mute_usernames_list: string[] = [];
        for (let j = 0; j < currentMuted.length; j++) {
            let user = await this.userService.getByID(currentMuted[j].uuid);
            if (user && user.username) {
                mute_usernames_list.push(user.username);
            }
        }
        let target_list = await this.get_Admin_Owner(targetChannel);
        this.chatGateway.unmute_user(
            targetChannel.channelName,
            mutedUser.username,
            target_list,
            mutedUser.socketId[0]
        );
        return mute_usernames_list;
    }

    async getMessages(channelName: string, uuid: string) {
        let channel = await this.chatRepository.findOneBy({
            channelName: channelName,
        });
        if (!channel) throw new UnauthorizedException();
        return await this.convertChannelMessages(
            uuid,
            channel.messages,
            channel
        );
    }

    async private_channel_users(uuid: string, channel: string) {
        let currentChannel = await this.getByName(channel);
        let list: string[] = [];
        if (!currentChannel) {
            throw new HttpException("Invalid channel", HttpStatus.FOUND);
        }
        let is_authorized = false;
        if (currentChannel.channelOwner === uuid) {
            is_authorized = true;
        } else if (
            currentChannel.channelAdministrators.find(
                (element) => element.uuid === uuid
            ) !== undefined
        ) {
            is_authorized = true;
        }
        if (is_authorized === true) {
            for (let i = 0; i < currentChannel.users.length; i++) {
                if (currentChannel.users[i].uuid !== uuid) {
                    let username = await this.userService.getUsernameById(
                        currentChannel.users[i].uuid
                    );
                    if (username) {
                        list.push(username);
                    }
                }
            }
        }
        return list;
    }
}
