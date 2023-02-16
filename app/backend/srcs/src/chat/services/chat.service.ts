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

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatEntity)
        private chatRepository: Repository<ChatEntity>,
        private chatGateway: ChatGateway,
        private userService: UsersService
    ) {}

    async get_channels(uuid: string) {
        let user = await this.userService.getByID(uuid);
        if (!user) {
            throw new HttpException(
                "Error, invalid user",
                HttpStatus.BAD_REQUEST
            );
        }
        let channels = await this.chatRepository.find();
        if (!channels) {
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

    async create_channel(newChannel: any, uuid: string): Promise<ChatEntity> {
        let channel = await this.chatRepository.findOneBy({
            channelName: newChannel.channelName,
        });
        if (channel) {
            throw new HttpException(
                "Unavailable channel name",
                HttpStatus.FORBIDDEN
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
            return channel;
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
            return channel;
        }
        return null;
    }

    async convertChannelMessages(
        uuid: string,
        initial_messages: { uuid: string; message: string }[]
    ) {
        let user = await this.userService.getByID(uuid);
        if (!user) {
            throw new UnauthorizedException();
        }
        let blocked_users = user.blocked;
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
                    returned_messages.push({
                        username: chat_user.username,
                        message: initial_messages[i].message,
                    });
                }
            }

            i++;
        }
        return returned_messages;
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
                    channels[index_in_authorized_channels].messages
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
            return this.convertChannelMessages(user.uuid, channel.messages);
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
                        channel.messages
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
        this.chatGateway.newChannelAvailable();
        return this.convertChannelMessages(uuid, channel.messages);
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
                                        channels[i].messages
                                    );
                                return {
                                    channelName: channels[i].channelName,
                                    messages: messages,
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
}
