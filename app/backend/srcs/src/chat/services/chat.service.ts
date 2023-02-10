import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChannelType, ChatEntity } from "../entities/chat.entity.";
import { Repository } from "typeorm";
import { ChatGateway } from "../gateways/ChatGateway";
import * as bcrypt from "bcrypt";
import { PublicChannelDTO } from "../dtos/newChannel.dto";
import { UsersService } from "src/users/services/users.service";

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatEntity)
        private chatRepository: Repository<ChatEntity>,
        private chatGateway: ChatGateway,
        private userService: UsersService
    ) {}

    async get_channels() {
        return await this.chatRepository.find();
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
        if (newChannel.channelType === ChannelType.PROTECTED) {
            let hashed_password = await this.encode_password(
                newChannel.channelPassword
            );
            newChannel.channelPassword = hashed_password;
        }
        const channel = await this.chatRepository.save(newChannel);
        if (channel) {
            this.chatGateway.newChannelAvailable(channel);
            return null;
        }
        return channel;
    }

    async join_channel(channelName: string, userID: string) {
        let channels = await this.get_channels();
        if (channels.length === 0) {
            this.create_general_channel();
        }
        let channel = await this.chatRepository.findOneBy({
            channelName: channelName,
        });
        if (!channel) throw new UnauthorizedException();
        let user = await this.userService.getByID(userID);
        if (!user) throw new UnauthorizedException();
        if (channel.channelType === ChannelType.PUBLIC) {
            this.chatGateway.userJoinChannel(
                channel.channelName,
                user.username
            );
        }
    }

    async send_public_message(
        channelName: string,
        userID: string,
        message: string
    ) {
        let channel = await this.chatRepository.findOneBy({
            channelName: channelName,
        });
        let user = await this.userService.getByID(userID);
        if (!channel || !user) throw new UnauthorizedException();
        if (channel.channelType === ChannelType.PUBLIC) {
            return this.chatGateway.send_message(
                channel.channelName,
                user.username,
                message
            );
        } else {
            throw new UnauthorizedException();
        }
    }
}
