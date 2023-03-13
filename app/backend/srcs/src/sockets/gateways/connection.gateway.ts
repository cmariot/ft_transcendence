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
        console.log(data.username, `(${client.id})`, "is online.");
        let user: UserEntity = await this.userService.getByUsername(
            data.username
        );
        console.log;
        if (!user) {
            throw new UnauthorizedException("User not found.");
        }
        for (let i = 0; i < user.socketId.length; i++) {
            if (user.socketId[i] !== client.id) {
                await this.disconnect(user.socketId[i]);
            }
        }
        await this.userService.login(user.uuid, new Array<string>(client.id));
        await this.sendStatus(data.username, "online");
        return;
    }

    // Disconnect an user in the frontend
    async disconnect(socketID: string) {
        // Emit an event to the frontend : navigate to /login and disconnect user
        this.server.to(socketID).emit("user.disconnect", { socket: socketID });
        console.log("disconnect", socketID, "in the frontend");
        return;
    }

    // A la deconnexion d'un utilisateur
    @SubscribeMessage("user.logout")
    async handleLogout(
        @MessageBody() data: { username: string },
        @ConnectedSocket() client: Socket
    ) {
        console.log(data.username, `(${client.id})`, "is offline.");
        const user: UserEntity = await this.userService.getByUsername(
            data.username
        );
        if (!user) {
            throw new UnauthorizedException("User not found.");
        }
        for (let i = 0; i < user.socketId.length; i++) {
            if (user.socketId[i] !== client.id) {
                await this.disconnect(user.socketId[i]);
            }
        }
        await this.userService.logout(user.uuid);
        this.sendStatus(user.username, "offline");
        return;
    }

    // A la deconnexion d'un client
    async handleDisconnect(client: Socket) {
        const user = await this.userService.getBySocket(client.id);
        if (user) {
            for (let i = 0; i < user.socketId.length; i++) {
                await this.disconnect(user.socketId[i]);
            }
            await this.userService.logout(user.uuid);
            this.sendStatus(user.username, "offline");
            return;
        }
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
