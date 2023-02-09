import { OnModuleInit } from "@nestjs/common";
import {
    MessageBody,
    SubscribeMessage,
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
        this.server.emit("newChannelAvailable", {
            content: data,
        });
    }
}
