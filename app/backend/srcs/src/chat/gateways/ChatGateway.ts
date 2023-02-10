import { OnModuleInit } from "@nestjs/common";
import {
    MessageBody,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway(3001, { cors: { origin: "http://frontend" } })
export class ChatGateway implements OnModuleInit {
    @WebSocketServer()
    server: Server;

    onModuleInit() {
        this.server.on("connection", (socket) => {
            console.log("new client connected to the app", socket.id);
            socket.on("disconnect", () => {
                console.log("client", socket.id, " disconnected");
                //this.userService.setUserStatus("OFFLINE", socket.id)
            });
        });
    }

    //@SubscribeMessage("newChannelAvailable")
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
        console.log("userJoinChannel");
        this.server.emit("newMessage", {
            channel: channel,
            username: username,
            message: message,
        });
    }
}
