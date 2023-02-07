import { OnModuleDestroy, OnModuleInit } from "@nestjs/common";
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

    //@SubscribeMessage("newMessage")
    //onNewMessage(@MessageBody() data: any) {
    //    console.log("NEWMESSAGE : ", data);
    //    console.log("EMIT TO BROADCAST :");
    //    this.server.emit("onMessage", { message: "NewMessage", content: data });
    //    return data;
    //}
}
