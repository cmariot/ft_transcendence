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
            console.log(
                "new user connected to the app, his socket is : ",
                socket.id
            );
            socket.on("disconnect", () => {
                console.log("user disconnected");
            });
        });
    }

    @SubscribeMessage("newChannelAvailable")
    onNewChannel(@MessageBody() data: any) {
        console.log("NEWCHANNEL : ", data);
        console.log("EMIT TO BROADCAST :");
        this.server.emit("onNewChannel", {
            message: "New Channel available",
            content: data,
        });
        return data;
    }
}
