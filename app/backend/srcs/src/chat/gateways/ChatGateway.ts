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
import { ChatService } from "../services/chat.service";
@WebSocketGateway(3001, { cors: { origin: "http://frontend" } })
export class ChatGateway implements OnModuleInit {
    constructor(
        private chatService: ChatService,
        private userService: UsersService
    ) {}

    @WebSocketServer()
    server: Server;

    onModuleInit() {
        this.server.on("connection", (socket) => {
            socket.on("disconnect", async () => {
                let username;
                username = await this.userService.userDisconnection(socket.id);
                if (username) {
                    this.sendStatus(username, "Offline");
                }
            });
        });
    }

    newChannelAvailable() {
        console.log("Backend emit 'newChannelAvailable' with data: ");
        this.server.emit("newChannelAvailable");
    }

    async userJoinChannel(channel: string, username: string) {
        console.log(
            "Backend emit 'userChannelConnection' with data: ",
            channel,
            username
        );
        //let user = await this.userService.getByUsername(username);
        // remove user from previousChannel.currentUsers
        // add user in channel.currentUsers
        this.server.emit("userChannelConnection", {
            channel: channel,
            username: username,
        });
    }

    send_message(channel: string, username: string, message: string) {
        console.log(
            "Backend emit 'newChatMessage' with data: ",
            channel,
            username,
            message
        );
        this.server.emit("newChatMessage", {
            channel: channel,
            username: username,
            message: message,
        });
        return message;
    }

    @SubscribeMessage("userStatus")
    async userStatus(@MessageBody() data: any) {
        let user = await this.chatService.UserConnection(
            data.username,
            data.socket,
            data.status
        );
        this.sendStatus(user, data.status);
    }

    async sendStatus(username: string, status: string) {
        this.server.emit("userStatus", {
            username: username,
            status: status,
        });
    }
}
