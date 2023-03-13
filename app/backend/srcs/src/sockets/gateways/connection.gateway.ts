import {
    Injectable,
    Req,
    UnauthorizedException,
    UseGuards,
} from "@nestjs/common";
import { Server, Socket } from "socket.io";
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { UsersService } from "src/users/services/users.service";
import { UserEntity } from "src/users/entity/user.entity";

@Injectable()
@WebSocketGateway(3001, { cors: { origin: "https://localhost:8443" } })
export class ConnectionGateway {
    constructor(private userService: UsersService) {}

    @WebSocketServer()
    server: Server;

    // A la connexion d'un utilisateur
    @SubscribeMessage("user.login")
    async handleLogin(
        @MessageBody() data: { username: string },
        @ConnectedSocket() client: Socket
    ) {
        console.log(
            "[backend] receive user.login :",
            data.username,
            `(${client.id})`,
            "is online."
        );
        // Get the user
        let user: UserEntity = await this.userService.getByUsername(
            data.username
        );
        if (!user) {
            throw new UnauthorizedException("User not found.");
        }
        // Disconnect other user clients
        for (let i = 0; i < user.socketId.length; i++) {
            this.disconnect(user.socketId[i]);
            user.socketId.slice(i, 1);
        }
        // Save the user socket id
        user.socketId.push(client.id);
        await this.userService.login(user.uuid, user.socketId);
        // Update status
        await this.sendStatus(data.username, "online");
        return;
    }

    // Disconnect an user in the frontend
    async disconnect(socketID: string) {
        console.log("disconnect", socketID, "in the frontend");
        // Emit an event to the frontend : navigate to /login and disconnect user
        this.server.to(socketID).emit("user.disconnect", { socket: socketID });
        return;
    }

    // A la deconnexion d'un utilisateur
    @SubscribeMessage("user.logout")
    async handleLogout(
        @MessageBody() data: { username: string },
        @ConnectedSocket() client: Socket
    ) {
        console.log(
            "[backend] receive user.logout :",
            data.username,
            `(${client.id})`,
            "is logged out."
        );
        const username = await this.userService.logout(
            data.username,
            client.id
        );
        if (username) {
            this.sendStatus(username, "offline");
        }
        return;
    }

    // A la deconnexion d'un client
    async handleDisconnect(client: Socket) {
        console.log(
            "[backend] receive close connection event :",
            `(${client.id})`
        );
        const username = await this.userService.close(client.id);
        if (username) {
            this.sendStatus(username, "offline");
        }
        return;
    }

    // Envoyer un event de changement de status
    async sendStatus(username: string, status: string) {
        console.log("status.update :", username, "is", status);
        this.server.emit("status.update", {
            username: username,
            status: status,
        });
        return;
    }
}
