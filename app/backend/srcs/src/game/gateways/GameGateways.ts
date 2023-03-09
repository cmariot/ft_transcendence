import { Injectable } from "@nestjs/common";
import { Server } from "socket.io";
import {
    MessageBody,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";

@Injectable()
@WebSocketGateway(3001, { cors: { origin: "http://frontend" } })
export class GameGateway {
    @WebSocketServer()
    server: Server;

    async sendCancel(socketId: string, status: string) {
        this.server.to(socketId).emit("gameStatus", {
            status: "Cancel",
        });
    }

    async sendInvitation(socketId: string, hostID: string) {
        this.server.to(socketId).emit("gameInvitation", { host: hostID });
    }

    async sendEndGameStatus(
        socketId: string,
        status: string,
        victory: boolean
    ) {
        this.server.to(socketId).emit("EndGameStatus", {
            status: status,
            victory: victory,
        });
    }
}
