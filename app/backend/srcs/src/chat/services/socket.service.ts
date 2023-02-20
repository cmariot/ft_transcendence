import { Injectable } from "@nestjs/common";
import { Server } from "socket.io";
import {
    MessageBody,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { UsersService } from "src/users/services/users.service";

@Injectable()
@WebSocketGateway(3001, { cors: { origin: "http://frontend" } })
export class SocketService {
    constructor(private userService: UsersService) {}

    @WebSocketServer()
    server: Server;

    async UserConnection(
        username: string,
        sockectID: string,
        status: string
    ): Promise<string> {
        let user;
        if (username && sockectID && status === "Online") {
            user = await this.userService.setSocketID(
                username,
                sockectID,
                status
            );
        }
        if (sockectID && status === "Offline") {
            user = await this.userService.userDisconnection(sockectID);
        }
        console.log("User Status : ", username, status);
        return user;
    }

    userUpdate(@MessageBody() username: string) {
        this.server.emit("userUpdate", {
            username: username,
        });
    }
}
