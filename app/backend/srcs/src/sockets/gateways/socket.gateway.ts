import { Injectable } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";

@Injectable()
export class SocketService {
    //@WebSocketServer()
    //server: Server;

    async sendStatus(username: string, status: string) {
        //this.server.emit("status.update", {
        //    username: username,
        //    status: status,
        //});
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
