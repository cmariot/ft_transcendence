import { OnModuleInit, Req, UseGuards } from "@nestjs/common";
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway(3001, { cors: { origin: "http://frontend" } })
export class MyGateway implements OnModuleInit {
    @WebSocketServer()
    server: Server;

    onModuleInit() {
        this.server.on("connection", (socket) => {
            console.log("ON MODULE INIT : ");
            console.log("CONNECTED : ", socket.id);
        });
    }

    @SubscribeMessage("newMessage")
    onNewMessage(@MessageBody() data: any) {
        console.log("NEWMESSAGE : ", data);
        console.log("EMIT TO BROADCAST :");
        this.server.emit("onMessage", { message: "NewMessage", content: data });
        return data;
    }
}
