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
            socket.on("disconnect", async () => {
                //let username = await this.userService.userDisconnection(
                //    socket.id
                //);
                //if (username) {
                //    this.sendStatus(username, "Offline");
                //}
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
    userStatus(@MessageBody() data: any) {
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
