import { Injectable } from "@nestjs/common";
import { Server } from "socket.io";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";

@Injectable()
@WebSocketGateway(3001, { cors: { origin: "https://localhost:8443" } })
export class UserGateway {
    @WebSocketServer()
    server: Server;

    // Emit an event when an user change his username
    async updateUsername(previousUsername: string, newUsername: string) {
        this.server.emit("user.update.username", {
            previousUsername: previousUsername,
            newUsername: newUsername,
        });
    }

    // Emit an event when an user change his username
    async updateAvatar(username: string) {
        this.server.emit("user.update.avatar", {
            username: username,
        });
    }

    // Envoyer un event de changement de status
    sendStatus(username: string, status: string) {
        this.server.emit("status.update", {
            username: username,
            status: status,
        });
    }

    // Send a leaderboard rank update
    rankUpdate(rank: number, socket: string) {
        this.server.to(socket).emit("rank.update", {
            rank: rank,
        });
    }
}
