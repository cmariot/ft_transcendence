import { Injectable } from "@nestjs/common";
import { NewChannelDTO } from "../dtos/newChannel.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ChatEntity } from "../entities/chat.entity.";
import { Repository } from "typeorm";
import { ChatGateway } from "../gateways/ChatGateway";

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatEntity)
        private chatRepository: Repository<ChatEntity>,
        private chatGateway: ChatGateway
    ) {}

    async get_channels(): Promise<ChatEntity[]> {
        return await this.chatRepository.find();
    }

    async create_channel(
        newChannel: NewChannelDTO,
        uuid: string
    ): Promise<ChatEntity> {
        newChannel.channelOwner = uuid;
        const channel = await this.chatRepository.save(newChannel);
        if (channel) {
            this.chatGateway.newChannelAvailable(channel);
            return null;
        }
        return channel;
    }
}
