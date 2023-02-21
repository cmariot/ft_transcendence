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
    @WebSocketServer()
    server: Server;

    userUpdate(@MessageBody() username: string) {
        this.server.emit("userUpdate", {
            username: username,
        });
    }
}
