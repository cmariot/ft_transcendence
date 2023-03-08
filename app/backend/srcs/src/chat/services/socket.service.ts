import { Injectable } from "@nestjs/common";
import { Server } from "socket.io";
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";

@Injectable()
@WebSocketGateway(3001, { cors: { origin: "http://frontend" } })
export class SocketService {
    @WebSocketServer()
    server: Server;

    onModuleInit() {
        this.server.on("connection", (socket) => {
            socket.on("disconnect", async () => {
                // let user = await this.userService.getBySocket(socket.id);
                // if (user) {
                //     if (
                //         user.status === "MatchMaking" ||
                //         user.status === "In_Game"
                //     ) {
                //         this.gameService.handleDisconnect(user);
                //     }
                // }
                // let username = await this.userService.userDisconnection(
                //     socket.id
                // );
                // if (username) {
                //     this.sendStatus(username, "Offline");
                // }
            });
        });
    }

    @SubscribeMessage("userStatus")
    async userStatus(@MessageBody() data: any) {
        //let username: string = data.username;
        //let socketID: string = data.socket;
        //let status: string = data.status;
        //let user: string;
        //if (username && socketID && status === "Online") {
        //    user = await this.userService.setSocketID(
        //        username,
        //        socketID,
        //        status
        //    );
        //}
        //if (socketID && status === "Offline") {
        //    user = await this.userService.userDisconnection(socketID);
        //}
        //if (socketID && status === "In_Game") {
        //    user = await this.userService.setStatus(socketID, status);
        //}
        //if (socketID && status === "MatchMaking") {
        //    user = await this.userService.setStatus(socketID, status);
        //}
        //this.sendStatus(user, data.status);
    }

    async sendStatus(username: string, status: string) {
        this.server.emit("userStatus", {
            username: username,
            status: status,
        });
    }

    userUpdate(@MessageBody() username: string, updateType: string) {
        this.server.emit("userUpdate", {
            username: username,
            updateType: updateType,
        });
    }

    async disconnect_user(socketId: string) {
        let socket = this.server.sockets.sockets.get(socketId);
        if (socket) {
            socket.emit("userLogout");
        }
    }
}
