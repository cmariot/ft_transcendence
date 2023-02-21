import { OnModuleInit } from "@nestjs/common";
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { UsersService } from "src/users/services/users.service";
@WebSocketGateway(3001, { cors: { origin: "http://frontend" } })
export class ChatGateway implements OnModuleInit {
    constructor(private userService: UsersService) {}

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

    channelUpdate() {
        this.server.emit("newChannelAvailable");
    }

    async userJoinChannel(channel: string, username: string) {
        let user = await this.userService.getByUsername(username);
        if (!user) {
            return;
        }
        let i = 0;
        while (i < user.socketId.length) {
            let socket_key = user.socketId[i];
            let socket = this.server.sockets.sockets.get(socket_key);
            if (socket && socket.join) {
                var iterator = socket.rooms.values();
                for (let j = 0; j < socket.rooms.size; j++) {
                    socket.leave(iterator.next().value);
                }
                socket.join(channel);
            }
            i++;
        }
    }

    send_message(channel: string, username: string, message: string) {
        console.log(
            "Backend emit 'newChatMessage' with data: ",
            channel,
            username,
            message
        );
        this.server.to(channel).emit("newChatMessage", {
            channel: channel,
            username: username,
            message: message,
        });
        return message;
    }

    ban_user(channel: string, username: string) {
        this.server.emit("banUser", {
            channel: channel,
            username: username,
        });
        return username;
    }

    @SubscribeMessage("userStatus")
    async userStatus(@MessageBody() data: any) {
        let username: string = data.username;
        let socketID: string = data.socket;
        let status: string = data.status;
        let user: string;
        if (username && socketID && status === "Online") {
            user = await this.userService.setSocketID(
                username,
                socketID,
                status
            );
        }
        if (socketID && status === "Offline") {
            user = await this.userService.userDisconnection(socketID);
        }
        if (socketID && status === "In_Game") {
            user = await this.userService.setStatus(socketID, status);
        }
        if (socketID && status === "MatchMaking") {
            user = await this.userService.setStatus(socketID, status);
        }
        this.sendStatus(user, data.status);
    }

    async sendStatus(username: string, status: string) {
        this.server.emit("userStatus", {
            username: username,
            status: status,
        });
    }
}
