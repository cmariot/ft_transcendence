import { Injectable, Req, UseGuards } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { UsersService } from "src/users/services/users.service";
import { isLogged } from "src/auth/guards/authentification.guards";

@Injectable()
@WebSocketGateway(3001, { cors: { origin: "https://localhost:8443" } })
export class ConnectionGateway {
    constructor(private userService: UsersService) {}

    @WebSocketServer()
    server: Server;

    // A la connexion d'un utilisateur
    @SubscribeMessage("user.login")
    handleLogin(
        @MessageBody() data: { username: string },
        @ConnectedSocket() client: Socket
    ) {
        this.userService.login(data.username, client.id);
        this.sendStatus(data.username, "online");
    }

    // A la deconnexion d'un utilisateur
    @SubscribeMessage("user.logout")
    handleLogout(
        @MessageBody() data: { username: string },
        @ConnectedSocket() client: Socket
    ) {
        this.userService.logout(data.username, client.id);
        this.sendStatus(data.username, "offline");
    }

    // A la deconnexion d'un client
    async handleDisconnect(client: Socket, @Req() req) {
        const username = await this.userService.close(client.id);
        if (username) {
            this.sendStatus(username, "offline");
        }
    }

    // Envoyer un event de changement de status
    async sendStatus(username: string, status: string) {
        console.log("status.update :", username, "is", status);
        this.server.emit("status.update", {
            username: username,
            status: status,
        });
    }
}
