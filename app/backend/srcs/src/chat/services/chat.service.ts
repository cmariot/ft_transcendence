import {
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChannelType, ChatEntity } from "../entities/chat.entity.";
import { Repository } from "typeorm";
import { ChatGateway } from "../gateways/ChatGateway";
import * as bcrypt from "bcrypt";
import { UsersService } from "src/users/services/users.service";
import { IsUUID } from "class-validator";
import {
    addAdminDTO,
    channelDTO,
    updateChannelDTO,
} from "../dtos/channelId.dto";
import { UserEntity } from "src/users/entity/user.entity";
import { muteOptionsDTO } from "../dtos/admin.dto";

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatEntity)
        private chatRepository: Repository<ChatEntity>,
        private chatGateway: ChatGateway,
        private userService: UsersService
    ) {}

    async getByName(channelName: string) {
        return await this.chatRepository.findOneBy({
            channelName: channelName,
        });
    }

    async get_channels(uuid: string) {
        let user = await this.userService.getByID(uuid);
        if (!user) {
            throw new HttpException(
                "Error, invalid user",
                HttpStatus.BAD_REQUEST
            );
        }
        let channels = await this.chatRepository.find();
        if (!channels || channels.length === 0) {
            let general = await this.create_general_channel();
            if (!general) {
                throw new HttpException(
                    "Error, impossible to create the general channel",
                    HttpStatus.FAILED_DEPENDENCY
                );
            }
            channels.push(general);
        }
        let userChannels: ChatEntity[] = [];
        let userPrivateChannels: ChatEntity[] = [];
        let availableChannels: ChatEntity[] = [];
        let i = 0;
        let found = false;
        while (i < channels.length) {
            // user is the channel owner
            if (
                channels[i].channelOwner === user.uuid &&
                channels[i].channelType !== ChannelType.PRIVATE
            ) {
                userChannels.push(channels[i]);
            } else if (
                channels[i].channelType === "public" ||
                channels[i].channelType === "protected"
            ) {
                let j = 0;
                while (j < channels[i].users.length) {
                    if (channels[i].users[j].uuid === user.uuid) {
                        // user has joined this channel
                        userChannels.push(channels[i]);
                        found = true;
                        break;
                    }
                    j++;
                }
                if (found === false) {
                    // it's an available channel
                    availableChannels.push(channels[i]);
                } else {
                    found = false;
                }
            } else {
                let j = 0;
                while (j < channels[i].allowed_users.length) {
                    if (channels[i].allowed_users[j].uuid === user.uuid) {
                        // a private conversation
                        let blocked_users = user.blocked;
                        if (!blocked_users) {
                            userPrivateChannels.push(channels[i]);
                            break;
                        } else {
                            let k = 0;
                            while (k < channels[i].allowed_users.length) {
                                let l = 0;
                                while (l < blocked_users.length) {
                                    if (
                                        channels[i].allowed_users[k].uuid ===
                                        blocked_users[l]
                                    ) {
                                        found = true;
                                        break;
                                    }
                                    l++;
                                }
                                if (found === true) {
                                    break;
                                }
                                k++;
                            }
                            if (found === false) {
                                userPrivateChannels.push(channels[i]);
                            } else {
                                found = true;
                            }
                            break;
                        }
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

    async encode_password(rawPassword: string): Promise<string> {
        const saltRounds: number = 11;
        const salt = bcrypt.genSaltSync(saltRounds);
        return bcrypt.hashSync(rawPassword, salt);
    }

    async create_general_channel(): Promise<ChatEntity> {
        const generalChannel: any = {
            channelName: "General",
            channelType: "public",
            channelOwner: "0",
        };
        return await this.chatRepository.save(generalChannel);
    }

    async create_channel(newChannel: any, uuid: string) {
        let channel = await this.chatRepository.findOneBy({
            channelName: newChannel.channelName,
        });
        if (channel) {
            throw new HttpException(
                "Unavailable channel name",
                HttpStatus.FOUND
            );
        }
        newChannel.channelOwner = uuid;
        if (
            newChannel.channelType === ChannelType.PROTECTED ||
            newChannel.channelType === ChannelType.PUBLIC
        ) {
            newChannel.users = [{ uuid: uuid }];
            if (newChannel.channelType === ChannelType.PROTECTED) {
                let hashed_password = await this.encode_password(
                    newChannel.channelPassword
                );
                newChannel.channelPassword = hashed_password;
            }
            const channel = await this.chatRepository.save(newChannel);
            if (channel) {
                this.chatGateway.newChannelAvailable();
            }
            return this.convertChannelMessages(uuid, channel.messages, channel);
        } else if (newChannel.channelType === ChannelType.PRIVATE) {
            console.log("ici : ", newChannel);
            let uuid_array: { uuid: string }[] = [];
            uuid_array.push({ uuid: newChannel.channelOwner });
            let i = 0;
            while (i < newChannel.allowed_users.length) {
                let allowed_user = await this.userService.getByUsername(
                    newChannel.allowed_users[i]
                );
                if (allowed_user) {
                    uuid_array.push({ uuid: allowed_user.uuid });
                }
                i++;
            }
            newChannel.allowed_users = uuid_array;
            const channel = await this.chatRepository.save(newChannel);
            if (channel) {
                this.chatGateway.newChannelAvailable();
            }
            return this.convertChannelMessages(uuid, channel.messages, channel);
        }
        return null;
    }

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
            if (
                !blocked_users ||
                blocked_users.indexOf(initial_messages[i].uuid) === -1
            ) {
                let chat_user = await this.userService.getByID(
                    initial_messages[i].uuid
                );
                if (chat_user) {
                    let i = 0;
                    let found = false;
                    while (i < banned_users.length) {
                        if ((banned_users[i].uuid = chat_user.uuid)) {
                            found = true;
                            break;
                        }
                        i++;
                    }
                    if (found === true) {
                        returned_messages.push({
                            username: chat_user.username,
                            message: "deleted message",
                        });
                        found = false;
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
        }
        return {
            messages: returned_messages,
            channel_owner: owner,
            channel_admin: admin,
            channel_admins: admins,
            banned_users: banned_users_list,
            muted_users: muted_users_list,
        };
    }

    async join_channel(channelName: string, userID: string) {
        let channels = await this.chatRepository.find();
        if (channels.length === 0) {
            this.create_general_channel();
        }
        let channel = await this.chatRepository.findOneBy({
            channelName: channelName,
        });
        if (!channel) throw new UnauthorizedException();
        let user = await this.userService.getByID(userID);
        if (!user) throw new UnauthorizedException();

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

        if (channel.channelType == ChannelType.PRIVATE) {
            let index_in_authorized_channels = channels.findIndex((element) => {
                if (element.channelName === channelName) return 1;
            });
            if (index_in_authorized_channels !== -1) {
                channel = channels[index_in_authorized_channels];
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
            this.chatGateway.newChannelAvailable();
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

    async send_message(channelName: string, userID: string, message: string) {
        let channel = await this.chatRepository.findOneBy({
            channelName: channelName,
        });

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
        if (!channel || !user) throw new UnauthorizedException();
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
        } else if (channel.channelType === ChannelType.PRIVATE) {
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
            throw new UnauthorizedException();
        }
    }

    async join_protected_channel(
        channelName: string,
        channelPassword: string,
        uuid: string
    ) {
        let channel = await this.chatRepository.findOneBy({
            channelName: channelName,
        });
        if (!channel || channel.channelType !== ChannelType.PROTECTED)
            throw new UnauthorizedException("Invalid channel");
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
            this.chatRepository.update(
                { channelName: channel.channelName },
                { users: channel_users }
            );
        }
        this.chatGateway.userJoinChannel(channel.channelName, user.username);
        this.chatGateway.newChannelAvailable();
        return this.convertChannelMessages(uuid, channel.messages, channel);
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
            if (channels[i].channelType === ChannelType.PRIVATE) {
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

    async leave_channel(channelName: string, uuid: string) {
        let channel = await this.chatRepository.findOneBy({
            channelName: channelName,
        });
        if (!channel) throw new UnauthorizedException("Invalid channel");
        let user = await this.userService.getByID(uuid);
        if (!user) throw new UnauthorizedException("Invalid user");

        if (
            channel.channelType === ChannelType.PUBLIC ||
            channel.channelType === ChannelType.PROTECTED
        ) {
            if (channel.channelOwner === uuid) {
                this.chatRepository.delete({ uuid: channel.uuid });
            } else {
                let index = channel.users.findIndex(
                    (element) => element.uuid === user.uuid
                );
                if (index !== -1) {
                    channel.users.splice(index, 1);
                    await this.chatRepository.update(
                        { channelName: channelName },
                        { users: channel.users }
                    );
                } else {
                    throw new UnauthorizedException();
                }
            }
            this.chatGateway.newChannelAvailable();
        } else if (channel.channelType === ChannelType.PRIVATE) {
            this.chatRepository.delete({ uuid: channel.uuid });
        }
        this.chatGateway.newChannelAvailable();
    }

    async upodateChannelPassword(
        targetChannel: ChatEntity,
        channel: updateChannelDTO
    ) {
        if (
            targetChannel.channelType === "public" &&
            channel.newChannelType === false
        ) {
            // do nothing
        } else if (
            targetChannel.channelType === "public" &&
            channel.newChannelType === true
        ) {
            // Change to protected and add password
            if (channel.newChannelPassword.length < 10) {
                throw new UnauthorizedException(
                    "Password must be 10 length min characters"
                );
            }
            await this.chatRepository.update(
                { uuid: targetChannel.uuid },
                { channelType: ChannelType.PROTECTED }
            );
            let hashed_password = await this.encode_password(
                channel.newChannelPassword
            );
            await this.chatRepository.update(
                { uuid: targetChannel.uuid },
                { channelPassword: hashed_password }
            );
        } else if (
            targetChannel.channelType === "protected" &&
            channel.newChannelType === false
        ) {
            // Change to public and remove password
            await this.chatRepository.update(
                { uuid: targetChannel.uuid },
                { channelType: ChannelType.PUBLIC }
            );
            await this.chatRepository.update(
                { uuid: targetChannel.uuid },
                { channelPassword: "" }
            );
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
            throw new UnauthorizedException();
        }
        this.chatGateway.newChannelAvailable();
        return "updated";
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
        let currentAdmin = channel.channelAdministrators;
        let i = 0;
        while (i < currentAdmin.length) {
            if (newAdminUUID === currentAdmin[i].uuid) {
                throw new HttpException("Already admin", HttpStatus.FOUND);
            }
            i++;
        }
        currentAdmin.push({ uuid: newAdminUUID });
        await this.chatRepository.update(
            { uuid: channel.uuid },
            { channelAdministrators: currentAdmin }
        );
    }

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
        await this.chatRepository.update(
            { uuid: channel.uuid },
            { channelAdministrators: currentAdmin }
        );
    }

    async ban(
        user: UserEntity,
        mutedUser: UserEntity,
        targetChannel: ChatEntity,
        muteOptions: muteOptionsDTO
    ) {
        let currentBanned = targetChannel.banned_users;
        let i = 0;
        let found = false;
        while (i < currentBanned.length) {
            if (mutedUser.uuid === currentBanned[i].uuid) {
                currentBanned[i].ban_date = Date.now().toString();
                currentBanned[i].ban_duration = muteOptions.duration.toString();
                found = true;
                break;
            }
            i++;
        }
        if (found === false) {
            console.log(muteOptions.duration.toString());
            currentBanned.push({
                uuid: mutedUser.uuid,
                ban_date: Date.now().toString(),
                ban_duration: muteOptions.duration.toString(),
            });
        }
        await this.chatRepository.update(
            { uuid: targetChannel.uuid },
            { banned_users: currentBanned }
        );
        this.chatGateway.ban_user(
            targetChannel.channelName,
            muteOptions.username
        );

        this.chatGateway.newChannelAvailable();
    }

    async unban(
        user: UserEntity,
        mutedUser: UserEntity,
        targetChannel: ChatEntity,
        muteOptions: muteOptionsDTO
    ) {
        let currentBanned = targetChannel.banned_users;
        let i = 0;
        let found = false;
        while (i < currentBanned.length) {
            if (mutedUser.uuid === currentBanned[i].uuid) {
                currentBanned.splice(i, 1);
                found = true;
                break;
            }
            i++;
        }
        if (found === false) {
            throw new HttpException(
                "This user wasn't banned",
                HttpStatus.FOUND
            );
        }
        await this.chatRepository.update(
            { uuid: targetChannel.uuid },
            { banned_users: currentBanned }
        );
    }

    async mute(
        user: UserEntity,
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
            console.log(muteOptions.duration.toString());
            currentMuted.push({
                uuid: mutedUser.uuid,
                mute_date: Date.now().toString(),
                mute_duration: muteOptions.duration.toString(),
            });
        }
        await this.chatRepository.update(
            { uuid: targetChannel.uuid },
            { mutted_users: currentMuted }
        );
    }

    async unmute(
        user: UserEntity,
        mutedUser: UserEntity,
        targetChannel: ChatEntity,
        muteOptions: muteOptionsDTO
    ) {
        let currentMuted = targetChannel.mutted_users;
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
            throw new HttpException("This user wasn't muted", HttpStatus.FOUND);
        }
        await this.chatRepository.update(
            { uuid: targetChannel.uuid },
            { mutted_users: currentMuted }
        );
    }
}
