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
			console.log("SOCKET SERVER: ", socket.id);
            socket.on("disconnect", async () => {
				let username;
                username = await this.userService.userDisconnection(
                    socket.id
                );
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
    async userStatus(@MessageBody() data: any) {
        let user = await this.socketService.UserConnection(
            data.username,
            data.socket,
            data.status
        );
        this.sendStatus(user, data.status);
    }

    async sendStatus(username: string, status: string) {
        console.log("Send user Status : ", username, status);
        this.server.emit("userStatus", {
            username: username,
            status: status,
        });
    }
}
