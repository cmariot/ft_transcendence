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

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatEntity)
        private chatRepository: Repository<ChatEntity>,
        private chatGateway: ChatGateway,
        private userService: UsersService
    ) {}

    async get_channels(uuid: string) {
        let channels = await this.chatRepository.find();
        let returned_channels: ChatEntity[] = [];
        let i = 0;
        while (i < channels.length) {
            if (channels[i].channelType === ChannelType.PRIVATE) {
                let j = 0;
                while (j < channels[i].allowed_users.length) {
                    if (channels[i].allowed_users[j].uuid === uuid) {
                        returned_channels.push(channels[i]);
                        break;
                    }
                    j++;
                }
            } else {
                returned_channels.push(channels[i]);
            }
            i++;
        }
        return returned_channels.sort((a, b) => {
            if (a.channelName > b.channelName) {
                return 1;
            }
            if (a.channelName < b.channelName) {
                return -1;
            }
            return 0;
        });
    }

    async encode_password(rawPassword: string): Promise<string> {
        const saltRounds: number = 11;
        const salt = bcrypt.genSaltSync(saltRounds);
        return bcrypt.hashSync(rawPassword, salt);
    }

    async create_general_channel() {
        const generalChannel: any = {
            channelName: "General",
            channelType: "public",
            channelOwner: "0",
        };
        return await this.chatRepository.save(generalChannel);
    }

    async create_channel(newChannel: any, uuid: string): Promise<ChatEntity> {
        newChannel.channelOwner = uuid;
        if (
            newChannel.channelType === ChannelType.PROTECTED ||
            newChannel.channelType === ChannelType.PUBLIC
        ) {
            if (newChannel.channelType === ChannelType.PROTECTED) {
                let hashed_password = await this.encode_password(
                    newChannel.channelPassword
                );
                newChannel.channelPassword = hashed_password;
            }
            const channel = await this.chatRepository.save(newChannel);
            if (channel) {
                this.chatGateway.newChannelAvailable(channel);
            }
            return channel;
        }
        if (newChannel.channelType === ChannelType.PRIVATE) {
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
                this.chatGateway.newChannelAvailable(channel);
            }
            return channel;
        }
        return null;
    }

    async convertChannelMessages(
        initial_messages: { uuid: string; message: string }[]
    ) {
        let returned_messages: { username: string; message: string }[] = [];
        let i = 0;
        while (i < initial_messages.length) {
            let user = await this.userService.getByID(initial_messages[i].uuid);
            if (user) {
                returned_messages.push({
                    username: user.username,
                    message: initial_messages[i].message,
                });
            }
            i++;
        }
        return returned_messages;
    }

    async join_channel(channelName: string, userID: string) {
        let channels = await this.get_channels(userID);
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
                    channels[index_in_authorized_channels].messages
                );
            }
        } else if (channel.channelType === ChannelType.PUBLIC) {
            this.chatGateway.userJoinChannel(
                channel.channelName,
                user.username
            );
            return this.convertChannelMessages(channel.messages);
        } else if (channel.channelType === ChannelType.PROTECTED) {
            let allowed_users = channel.allowed_users;
            let i = 0;
            while (i < allowed_users.length) {
                if (allowed_users[i].uuid === user.uuid) {
                    this.chatGateway.userJoinChannel(
                        channel.channelName,
                        user.username
                    );
                    return this.convertChannelMessages(channel.messages);
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
        } else if (
            channel.channelType === ChannelType.PROTECTED ||
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
        let allowedUsers = channel.allowed_users;
        allowedUsers.push({ uuid: user.uuid });
        await this.chatRepository.update(
            { uuid: channel.uuid },
            { allowed_users: allowedUsers }
        );
        this.chatGateway.userJoinChannel(channel.channelName, user.username);

        return this.convertChannelMessages(channel.messages);
    }
}
