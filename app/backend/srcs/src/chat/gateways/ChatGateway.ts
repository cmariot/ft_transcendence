import { OnModuleInit } from "@nestjs/common";
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { SocketService } from "../services/socket.service";
@WebSocketGateway(3001, { cors: { origin: "http://frontend" } })
export class ChatGateway implements OnModuleInit {
    constructor(private socketService: SocketService) {}
    @WebSocketServer()
    server: Server;

    onModuleInit() {
        this.server.on("connection", (socket) => {
            socket.on("disconnect", () => {
                let username = this.socketService.UserDisconnetion(socket.id);
                this.server.emit("userStatus", {
                    message: "A user is disconnected",
                    username: username,
                });
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
        console.log("RECEIVE: ", data);
        this.socketService.UserConnection(
            data.username,
            data.socket,
            data.status
        );
        return data;
    }
}
