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
                let username = await this.userService.userDisconnection(
                    socket.id
                );
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
            if (socket) {
                for (let room of socket.rooms) {
                    let valid = true;
                    for (
                        let k = 0;
                        k < "chatroom_".length && k < room[k].length;
                        k++
                    ) {
                        if (room[k] !== "chatroom_"[k]) {
                            valid = false;
                            break;
                        }
                    }
                    if (valid === true && room.length > "chatroom_".length) {
                        socket.leave(room);
                    }
                }

                let room_name: string = "chatroom_" + channel;
                socket.join(room_name);
            }
            i++;
        }
    }

    send_message(channel: string, username: string, message: string) {
        this.server.to("chatroom_" + channel).emit("newChatMessage", {
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

    kick_user(channelName: string, username: string) {
        this.server.emit("kickUser", {
            channel: channelName,
            username: username,
        });
    }

    deleted_channel(channel: string, username: string) {
        this.server.emit("isChannelDeleted", {
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

    async send_unmute_or_unban(
        channel: string,
        users_list: string[],
        target_list: string[],
        status: string
    ) {
        for (let i = 0; i < target_list.length; i++) {
            let socket = this.server.sockets.sockets.get(target_list[i]);
            if (socket) {
                socket.emit("unban/unmute", {
                    status: status,
                    channel: channel,
                    users_list: users_list,
                });
            }
        }
    }

    updateisChannelAdmin(username: string, channel: string, value: boolean) {
        this.server.emit("isChannelAdminUpdate", {
            username: username,
            channel: channel,
            value: value,
        });
    }

    leave_private(username: string, channelName: string) {
        this.server.emit("userLeaveChannel", {
            username: username,
            channel: channelName,
        });
    }
}
