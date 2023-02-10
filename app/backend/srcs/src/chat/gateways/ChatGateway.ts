import { OnModuleInit } from "@nestjs/common";
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { SocketService } from "../services/socket.service";
import { UsersService } from "src/users/services/users.service";
@WebSocketGateway(3001, { cors: { origin: "http://frontend" } })
export class ChatGateway implements OnModuleInit {
    constructor(
        private socketService: SocketService,
        private userService: UsersService
    ) {}

    @WebSocketServer()
    server: Server;

    onModuleInit() {
        this.server.on("connection", (socket) => {
            socket.on("disconnect", async () => {
                let username = await this.userService.userDisconnection(
                    socket.id
                );
				console.log("Disconnected User : ", username);
                if (username) {
                    this.sendStatus(username, "Offline");
                }
            });
        });
    }

    newChannelAvailable(@MessageBody() data: any) {
        console.log("newChannelAvailable");
        this.server.emit("newChannelAvailable", {
            content: data,
        });
    }

    userJoinChannel(channel: string, username: string) {
        console.log("userJoinChannel");
        this.server.emit("userChannelConnection", {
            channel: channel,
            username: username,
        });
    }

    send_message(channel: string, username: string, message: string) {
        this.server.emit("newMessage", {
            channel: channel,
            username: username,
            message: message,
        });
    }

    @SubscribeMessage("userStatus")
    userStatus(@MessageBody() data: any) {
        console.log("User Status : ", data.username, data.status);
        this.socketService.UserConnection(
            data.username,
            data.socket,
            data.status
        );
        return data;
    }

    sendStatus(username: string, status: string) {
        console.log("user Status : ", username, status);
        this.server.emit("userStatus", {
            username: username,
            status: status,
        });
    }
}
