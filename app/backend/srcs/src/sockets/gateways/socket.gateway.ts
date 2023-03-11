import { Injectable } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from "@nestjs/websockets";

@Injectable()
@WebSocketGateway(3001, { cors: { origin: "http://frontend" } })
export class SocketService {
    @WebSocketServer()
    server: Server;

    // Connection client
    handleConnection(client: Socket) {
        console.log(`cient connected: ${client.id}`);
    }

    // Disconnection client
    handleDisconnect(client: Socket) {
        console.log(`cient disconnected: ${client.id}`);
    }

    // Recevoir un event
    @SubscribeMessage("user.login")
    handleEvent(
        @MessageBody() data: { username: string },
        @ConnectedSocket() client: Socket
    ) {
        console.log(data.username, "is logged in. His socket is :", client.id);
        this.sendStatus(data.username, "online");
    }

    async sendStatus(username: string, status: string) {
        this.server.emit("status.update", {
            username: username,
            status: status,
        });
    }

    userUpdate(@MessageBody() username: string) {
        //this.server.emit("userUpdate", {
        //    username: username,
        //});
    }

    async disconnect_user(socketId: string) {
        // let socket = this.server.sockets.sockets.get(socketId);
        // if (socket) {
        //     socket.emit("userLogout");
        // }
    }
}
