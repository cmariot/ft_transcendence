import { Injectable } from "@nestjs/common";
import { Status } from "src/users/entity/user.entity";
import { UsersService } from "../../users/services/users.service";
import { ChatGateway } from "../gateways/ChatGateway";
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";

@Injectable()
export class SocketService {
	constructor(
        private chatGateway: ChatGateway,
        private userService: UsersService
    ) {}

    async UserConnection(username: string, sockectID: string, status: Status) {
		if (username && sockectID && status){
			this.userService.setSocketID(username, sockectID, status);
		}
    }

	async UserDisconnetion(socket: string){
		let username = await this.userService.userDisconnection(socket);
		if(username){
			this.chatGateway.sendStatus(username, "Offline");
		}
	}
}
