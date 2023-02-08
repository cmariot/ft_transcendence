import { Injectable } from "@nestjs/common";
import { NewChannelDTO } from "../dtos/newChannel.dto";

@Injectable()
export class ChatService {
    constructor() {}

    create_channel(newChannel: NewChannelDTO, uuid: string) {
        // verifs
        // sauvegarder nouveau channel
        // emmetre sur socket newChannelAvailable
    }
}
