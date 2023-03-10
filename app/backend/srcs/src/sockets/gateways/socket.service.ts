import { Injectable } from "@nestjs/common";
import { Server } from "socket.io";
import {
    MessageBody,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";

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

    async disconnect_user(socketId: string) {
        let socket = this.server.sockets.sockets.get(socketId);
        console.log("FORCE DISCO");
        if (socket) {
            socket.emit("userLogout");
        }
    }

    async sendStatus(username: string, status: string) {
        this.server.emit("changeStatus", {
            username: username,
            status: status,
        });
    }
}
