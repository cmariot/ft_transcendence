import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { isLogged } from "src/auth/guards/authentification.guards";
import {
    PrivateChannelDTO,
    ProtectedChannelDTO,
    PublicChannelDTO,
} from "../dtos/newChannel.dto";
import { ChatService } from "../services/chat.service";
import { ChatEntity } from "../entities/chat.entity.";
import { channelDTO, messageDTO } from "../dtos/channelId.dto";

@Controller("chat")
export class ChatController {
    constructor(private chatService: ChatService) {}

}
