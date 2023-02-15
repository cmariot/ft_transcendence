import { Injectable } from "@nestjs/common";
import { Status } from "src/users/entity/user.entity";
import { UsersService } from "../../users/services/users.service";
import { Server } from "socket.io";
import {
    MessageBody,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";

@Injectable()
@WebSocketGateway(3001, { cors: { origin: "http://frontend" } })
export class SocketService {
    //constructor(private userService: UsersService) {}

    @WebSocketServer()
    server: Server;

    async UserConnection(username: string, sockectID: string, status: Status) {
        //if (username && sockectID && status) {
        //    this.userService.setSocketID(username, sockectID, status);
        //}
    }

    userUpdate(@MessageBody() username: string) {
        this.server.emit("userUpdate", {
            username: username,
        });
    }

    chatUpdate() {
        this.server.emit("newChannelAvailable", {});
    }
}
