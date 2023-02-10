import { Injectable } from "@nestjs/common";
import { Status } from "src/users/entity/user.entity";
import { UsersService } from "../../users/services/users.service";
import { ChatGateway } from "../gateways/ChatGateway";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChatEntity } from "../entities/chat.entity.";

@Injectable()
export class SocketService {
    constructor(private userService: UsersService) {}

    async UserConnection(username: string, sockectID: string, status: Status) {
        if (username && sockectID && status) {
            this.userService.setSocketID(username, sockectID, status);
        }
    }
}
