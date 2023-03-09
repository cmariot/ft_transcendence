import { Inject, Injectable, Req, UseGuards, forwardRef } from "@nestjs/common";
import { Server } from "socket.io";
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from "@nestjs/websockets";
import { UsersService } from "../users/services/users.service";
import { isLogged } from "src/auth/guards/authentification.guards";

@Injectable()
@WebSocketGateway(3001, { cors: { origin: "http://frontend" } })
export class SocketService {
    constructor(
        @Inject(forwardRef(() => UsersService))
        private userService: UsersService
    ) {}

    @WebSocketServer()
    server: Server;

    // Listen to events from the frontend
    // Update the user status and emit an event with the username and the status

    @SubscribeMessage("userConnexion")
    userStatus(@MessageBody() data: any): WsResponse<unknown> {
        console.log("userConnexion");

        const username: string = data.username;
        const socketID: string = data.socket;
        const event = "userConnexion";

        if (!socketID || !username) {
            return { event, data };
        }
        this.userService.online(username, socketID);
        return { event, data };
    }

    async emit(message: string, object: {}) {
        return this.server.emit(message, object);
    }

    //    onModuleInit() {
    //        this.server.on("connection", (socket) => {
    //            socket.on("disconnect", async () => {
    //              CLOSE SOCKET !
    //                console.log(
    //                    "[BACKEND] client disconnection, find this socket :",
    //                    socket.id
    //                );
    //                let user = await this.userService.getBySocket(socket.id);
    //                if (user) {
    //                    if (
    //                        user.status === "MatchMaking" ||
    //                        user.status === "In_Game"
    //                    ) {
    //                        // Passer par userservice pour gerer deco
    //                        //this.gameService.handleDisconnect(user);
    //                    }
    //                }
    //                let username = await this.userService.userDisconnection(
    //                    socket.id
    //                );
    //                //if (username) {
    //                //    this.sendStatus(username, "Offline");
    //                //}
    //            });
    //        });
    //    }

    //
    //    async sendStatus(username: string, status: string) {
    //        this.server.emit("firendStatus", {
    //            username: username,
    //            status: status,
    //        });
    //    }
    //
    //    userUpdate(@MessageBody() username: string, updateType: string) {
    //        this.server.emit("userUpdate", {
    //            username: username,
    //            updateType: updateType,
    //        });
    //    }
    //
    //    async disconnect_user(socketId: string) {
    //        let socket = this.server.sockets.sockets.get(socketId);
    //        if (socket) {
    //            socket.emit("userLogout");
    //        }
    //    }
    //
    //    channelUpdate() {
    //        this.server.emit("newChannelAvailable");
    //    }
    //
    //    async userJoinChannel(channel: string, username: string) {
    //        console.log("In userJoinChannel ");
    //        let user = await this.userService.getByUsername(username);
    //        if (!user) {
    //            return;
    //        }
    //        console.log("User sockets :", user.socketId);
    //        let i = 0;
    //        while (i < user.socketId.length) {
    //            let socket_key = user.socketId[i];
    //            let socket = this.server.sockets.sockets.get(socket_key);
    //            if (socket) {
    //                for (let room of socket.rooms) {
    //                    let valid = true;
    //                    for (
    //                        let k = 0;
    //                        k < "chatroom_".length && k < room[k].length;
    //                        k++
    //                    ) {
    //                        if (room[k] !== "chatroom_"[k]) {
    //                            valid = false;
    //                            break;
    //                        }
    //                    }
    //                    if (valid === true && room.length > "chatroom_".length) {
    //                        console.log("Leave room", room);
    //                        socket.leave(room);
    //                    }
    //                }
    //
    //                let room_name: string = "chatroom_" + channel;
    //                socket.join(room_name);
    //                console.log("Join room", room_name);
    //            }
    //            i++;
    //        }
    //    }
    //
    //    send_message(channel: string, username: string, message: string) {
    //        this.server.to("chatroom_" + channel).emit("newChatMessage", {
    //            channel: channel,
    //            username: username,
    //            message: message,
    //        });
    //        return message;
    //    }
    //
    //    ban_user(channel: string, username: string) {
    //        this.server.emit("banUser", {
    //            channel: channel,
    //            username: username,
    //        });
    //        return username;
    //    }
    //
    //    kick_user(channelName: string, username: string) {
    //        this.server.emit("kickUser", {
    //            channel: channelName,
    //            username: username,
    //        });
    //    }
    //
    //    deleted_channel(channel: string, username: string) {
    //        this.server.emit("channelDeleted", {
    //            channel: channel,
    //            username: username,
    //        });
    //        return username;
    //    }
    //
    //    async send_unmute_or_unban(
    //        channel: string,
    //        users_list: string[],
    //        target_list: string[],
    //        status: string
    //    ) {
    //        for (let i = 0; i < target_list.length; i++) {
    //            let socket = this.server.sockets.sockets.get(target_list[i]);
    //            if (socket) {
    //                socket.emit("unban/unmute", {
    //                    status: status,
    //                    channel: channel,
    //                    users_list: users_list,
    //                });
    //            }
    //        }
    //    }
    //
    //    async set_admin(
    //        admin_list: string[],
    //        target_list: string[],
    //        channel_name: string
    //    ) {
    //        for (let i = 0; i < target_list.length; i++) {
    //            let socket = this.server.sockets.sockets.get(target_list[i]);
    //            if (socket) {
    //                socket.emit("UpdateAdmin", {
    //                    channel_name: channel_name,
    //                    admin_list: admin_list,
    //                });
    //            }
    //        }
    //    }
    //
    //    updateChannelAdmin(username: string, channel: string, value: boolean) {
    //        this.server.emit("channelAdminUpdate", {
    //            username: username,
    //            channel: channel,
    //            value: value,
    //        });
    //    }
    //
    //    leave_private(username: string, channelName: string) {
    //        this.server.emit("userLeaveChannel", {
    //            username: username,
    //            channel: channelName,
    //        });
    //    }
    //
    //    async sendCancel(socketId: string, status: string) {
    //        this.server.to(socketId).emit("gameStatus", {
    //            status: "Cancel",
    //        });
    //    }
    //
    //    async sendInvitation(socketId: string, hostID: string) {
    //        this.server.to(socketId).emit("gameInvitation", { host: hostID });
    //    }
    //
    //    async sendEndGameStatus(
    //        socketId: string,
    //        status: string,
    //        victory: boolean
    //    ) {
    //        this.server.to(socketId).emit("EndGameStatus", {
    //            status: status,
    //            victory: victory,
    //        });
    //    }
}
