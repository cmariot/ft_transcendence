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
import { channelDTO, updateChannelDTO } from "../dtos/channelId.dto";
import { UserEntity } from "src/users/entity/user.entity";
import {
    AddOptionsDTO,
    kickOptionsDTO,
    muteOptionsDTO,
} from "../dtos/admin.dto";

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
                channels[i].channelType !== ChannelType.PRIVATE &&
                channels[i].channelType !== ChannelType.PRIVATE_CHANNEL
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
                        let k = 0;
                        let banned = false;
                        while (k < channels[i].banned_users.length) {
                            if (
                                channels[i].banned_users[k].uuid === user.uuid
                            ) {
                                banned = true;
                                break;
                            }
                            k++;
                        }
                        if (banned === false) {
                            userChannels.push(channels[i]);
                            found = true;
                        }
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
                                            blocked_users[l] &&
                                        channels[i].channelType ===
                                            ChannelType.PRIVATE
                                    ) {
                                        found = true;
                                        break;
                                    } else if (
                                        channels[i].channelType ===
                                            ChannelType.PRIVATE_CHANNEL &&
                                        blocked_users[l] ===
                                            channels[i].channelOwner
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
        let user = await this.userService.getByID(uuid);
        if (!user) {
            throw new HttpException("Invalid user", HttpStatus.FOUND);
        }
        if (newChannel.channelType === ChannelType.PRIVATE_CHANNEL) {
            console.log("Create private channel");
            let uuid_array: { uuid: string }[] = [];
            uuid_array.push({ uuid: newChannel.channelOwner });
            newChannel.allowed_users = uuid_array;
            const channel = await this.chatRepository.save(newChannel);
            if (channel) {
                console.log("Saved :", channel);
                this.chatGateway.channelUpdate();
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
        } else if (
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
                this.chatGateway.channelUpdate();
            }
            this.chatGateway.userJoinChannel(
                channel.channelName,
                user.username
            );
            return this.convertChannelMessages(uuid, channel.messages, channel);
        } else if (newChannel.channelType === ChannelType.PRIVATE) {
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
                this.chatGateway.channelUpdate();
            }
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
        throw new HttpException("Invalid channel type.", HttpStatus.FOUND);
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
                channel.channelType === ChannelType.PRIVATE_CHANNEL &&
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

    async join_protected_channel(
        channelName: string,
        channelPassword: string,
        uuid: string
    ) {
        let channel = await this.chatRepository.findOneBy({
            channelName: channelName,
        });
        if (channel.channelType === ChannelType.PUBLIC) {
            this.join_channel(channelName, uuid);
        }
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
            await this.chatRepository.update(
                { channelName: channel.channelName },
                { users: channel_users }
            );
        }
        return this.join_channel(channelName, uuid);
    }

    async addPrivateChannel(addUser: AddOptionsDTO, uuid: string) {
        let user = await this.userService.getByUsername(addUser.username);
        if (!user) {
            throw new UnauthorizedException("Invalid user");
        }
        let channel = await this.getByName(addUser.channelName);
        if (!channel) {
            throw new UnauthorizedException("Invalid channel");
        }
        for (let i = 0; i < channel.banned_users.length; i++) {
            if (channel.banned_users[i].uuid === user.uuid) {
                throw new UnauthorizedException("Banned user");
            }
        }
        for (let i = 0; i < channel.allowed_users.length; i++) {
            if (channel.allowed_users[i].uuid === user.uuid) {
                throw new UnauthorizedException("Already allowed");
            }
        }
        let users = channel.allowed_users;
        users.push({ uuid: user.uuid });
        await this.chatRepository.update(
            { uuid: channel.uuid },
            { allowed_users: users }
        );
        let users_list: string[] = [];
        for (let i = 0; i < users.length; i++) {
            if (users[i].uuid !== channel.channelOwner) {
                let user = await this.userService.getByID(users[i].uuid);
                if (user && user.username) {
                    users_list.push(user.username);
                }
            }
        }
        this.chatGateway.channelUpdate();
        return users_list;
    }

    async banList(channelName: string, uuid: string) {
        let channel = await this.getByName(channelName);
        if (!channel) throw new UnauthorizedException("Invalid channel");
        let currentBanned = channel.banned_users;
        let ban_usernames_list: string[] = [];
        let is_authorized = false;
        if (channel.channelOwner === uuid) {
            is_authorized = true;
        } else if (
            channel.channelAdministrators.find(
                (element) => element.uuid === uuid
            ) !== undefined
        ) {
            is_authorized = true;
        }
        if (is_authorized === true) {
            for (let j = 0; j < currentBanned.length; j++) {
                let user = await this.userService.getByID(
                    currentBanned[j].uuid
                );
                if (user && user.username) {
                    ban_usernames_list.push(user.username);
                }
            }
        }
        return ban_usernames_list;
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

        if (
            channel.channelType === ChannelType.PRIVATE ||
            channel.channelType === ChannelType.PRIVATE_CHANNEL
        ) {
            let index_in_authorized_channels = channels.findIndex((element) => {
                if (element.channelName === channelName) return 1;
            });
            if (index_in_authorized_channels !== -1) {
                channel = channels[index_in_authorized_channels];

                let allowed_user = channel.allowed_users.findIndex(
                    (element) => {
                        if (element.uuid === user.uuid) return 1;
                    }
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

            this.chatGateway.channelUpdate();
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
                    this.chatGateway.channelUpdate();
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
        } else if (
            channel.channelType === ChannelType.PRIVATE ||
            channel.channelType === ChannelType.PRIVATE_CHANNEL
        ) {
            console.log("Send message");
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
                this.chatGateway.deleted_channel(
                    channel.channelName,
                    user.username
                );
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
                    index = channel.channelAdministrators.findIndex(
                        (element) => element.uuid === user.uuid
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
                    }
                } else {
                    throw new UnauthorizedException();
                }
            }
            this.chatGateway.channelUpdate();
        } else if (channel.channelType === ChannelType.PRIVATE) {
            this.chatGateway.deleted_channel(
                channel.channelName,
                user.username
            );
            this.chatRepository.delete({ uuid: channel.uuid });
        } else if (channel.channelType === ChannelType.PRIVATE_CHANNEL) {
            if (channel.channelOwner === uuid) {
                this.chatGateway.deleted_channel(
                    channel.channelName,
                    user.username
                );
                this.chatRepository.delete({ uuid: channel.uuid });
            } else {
                let index = channel.allowed_users.findIndex(
                    (element) => element.uuid === user.uuid
                );
                if (index !== -1) {
                    channel.allowed_users.splice(index, 1);
                    await this.chatRepository.update(
                        { channelName: channelName },
                        { allowed_users: channel.allowed_users }
                    );
                    index = channel.channelAdministrators.findIndex(
                        (element) => element.uuid === user.uuid
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
                    }
                    this.chatGateway.leave_private(user.username, channelName);
                } else {
                    throw new UnauthorizedException();
                }
            }
        }
        this.chatGateway.channelUpdate();
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
        this.chatGateway.channelUpdate();
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

        let newAdmin = await this.userService.getByID(newAdminUUID);
        if (!newAdmin) {
            return;
        }
        this.chatGateway.updateChannelAdmin(
            newAdmin.username,
            channel.channelName,
            true
        );
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
        let newAdmin = await this.userService.getByID(newAdminUUID);
        if (!newAdmin) {
            return;
        }
        this.chatGateway.updateChannelAdmin(
            newAdmin.username,
            channel.channelName,
            false
        );
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
            currentBanned.push({
                uuid: mutedUser.uuid,
                ban_date: Date.now().toString(),
                ban_duration: muteOptions.duration.toString(),
            });
        }
        if (muteOptions.duration > 0) {
            setTimeout(() => {
                this.timeout(
                    user,
                    mutedUser,
                    targetChannel,
                    muteOptions,
                    "ban"
                );
            }, muteOptions.duration * 1000);
        }
        await this.chatRepository.update(
            { uuid: targetChannel.uuid },
            { banned_users: currentBanned }
        );
        this.chatGateway.ban_user(
            targetChannel.channelName,
            muteOptions.username
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

    async kick(
        user: UserEntity,
        kickedUser: UserEntity,
        targetChannel: ChatEntity,
        options: kickOptionsDTO
    ) {
        if (
            targetChannel.channelType === "protected" ||
            targetChannel.channelType === "public"
        ) {
            let current_users = targetChannel.users;
            let index = -1;
            for (let i = 0; i < current_users.length; i++) {
                if (current_users[i].uuid === kickedUser.uuid) {
                    index = i;
                    this.leave_channel(
                        targetChannel.channelName,
                        current_users[i].uuid
                    );
                    return this.chatGateway.kick_user(
                        targetChannel.channelName,
                        kickedUser.username
                    );
                }
            }
        } else if (targetChannel.channelType === ChannelType.PRIVATE_CHANNEL) {
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

    async unban(
        user: UserEntity,
        mutedUser: UserEntity,
        targetChannel: ChatEntity,
        muteOptions: muteOptionsDTO
    ) {
        let channel = this.getByName(targetChannel.channelName);
        let currentBanned = (await channel).banned_users;
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
            return null;
        }
        await this.chatRepository.update(
            { uuid: targetChannel.uuid },
            { banned_users: currentBanned }
        );
        this.chatGateway.channelUpdate();
        let ban_usernames_list: string[] = [];
        for (let j = 0; j < currentBanned.length; j++) {
            let user = await this.userService.getByID(currentBanned[j].uuid);
            if (user && user.username) {
                ban_usernames_list.push(user.username);
            }
        }
        return ban_usernames_list;
    }

    async get_Admin_Owner(channel: ChatEntity) {
        let target_uuidList: string[] = null;
        let target_list: string[] = null;
        if (channel) {
            if (channel.channelOwner) {
                target_uuidList = [];
                target_uuidList.push(channel.channelOwner);
            }
            for (let i = 0; i < channel.channelAdministrators.length; i++) {
                target_uuidList.push(channel.channelAdministrators[i].uuid);
            }
            if (target_uuidList.length > 0) {
                target_list = [];
                for (let i = 0; i < target_uuidList.length; i++) {
                    let user = this.userService.getByID(target_uuidList[i]);
                    for (let j = 0; j < (await user).socketId.length; j++) {
                        target_list.push((await user).socketId[j]);
                    }
                }
            }
        }
        return target_list;
    }

    async timeout(
        user: UserEntity,
        mutedUser: UserEntity,
        targetChannel: ChatEntity,
        muteOptions: muteOptionsDTO,
        event: string
    ) {
        let users_list;
        if (event === "mute") {
            users_list = await this.unmute(
                user,
                mutedUser,
                targetChannel,
                muteOptions
            );
        }
        if (event === "ban") {
            users_list = await this.unban(
                user,
                mutedUser,
                targetChannel,
                muteOptions
            );
        }
        if (users_list !== null) {
            let target_list = await this.get_Admin_Owner(targetChannel);
            if (target_list) {
                this.chatGateway.send_unmute_or_unban(
                    targetChannel.channelName,
                    users_list,
                    target_list,
                    event
                );
            }
        }
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
            currentMuted.push({
                uuid: mutedUser.uuid,
                mute_date: Date.now().toString(),
                mute_duration: muteOptions.duration.toString(),
            });
        }
        if (muteOptions.duration > 0) {
            setTimeout(() => {
                this.timeout(
                    user,
                    mutedUser,
                    targetChannel,
                    muteOptions,
                    "mute"
                );
            }, Number(5) * 1000);
        }
        await this.chatRepository.update(
            { uuid: targetChannel.uuid },
            { mutted_users: currentMuted }
        );
        this.chatGateway.channelUpdate();
        let mute_usernames_list: string[] = [];
        for (let j = 0; j < currentMuted.length; j++) {
            let user = await this.userService.getByID(currentMuted[j].uuid);
            if (user && user.username) {
                mute_usernames_list.push(user.username);
            }
        }
        return mute_usernames_list;
    }

    async unmute(
        user: UserEntity,
        mutedUser: UserEntity,
        targetChannel: ChatEntity,
        muteOptions: muteOptionsDTO
    ) {
        let channel = this.getByName(targetChannel.channelName);
        let currentMuted = (await channel).mutted_users;
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
        this.chatGateway.channelUpdate();
        let mute_usernames_list: string[] = [];
        for (let j = 0; j < currentMuted.length; j++) {
            let user = await this.userService.getByID(currentMuted[j].uuid);
            if (user && user.username) {
                mute_usernames_list.push(user.username);
            }
        }
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
