import { OnModuleInit } from "@nestjs/common";
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { GameService } from "src/game/services/game.service";
import { UsersService } from "src/users/services/users.service";

@WebSocketGateway(3001, { cors: { origin: "https://localhost:8443" } })
export class ChatGateway {
    constructor(private userService: UsersService) {}

    @WebSocketServer()
    server: Server;

    // Emit an event when a new channel is available
    newChannelAvailable(channel: string) {
        this.server.emit("chat.new.channel", {
            channel: channel,
        });
    }

    // Join the chat channel room and leave the previous joined rooms
    async userJoinChannel(channel: string, username: string) {
        let user = await this.userService.getByUsername(username);
        if (!user) {
            return;
        }
        let i = 0;
        while (i < user.socketId.length) {
            let socket = this.server.sockets.sockets.get(user.socketId[i]);
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

    // When a message is post
    send_message(channel: string, username: string, message: string) {
        this.server.to("chatroom_" + channel).emit("chat.message", {
            channel: channel,
            username: username,
            message: message,
        });
    }

    // When a channel is deleted
    deleted_channel(channel: string, username: string) {
        this.server.emit("chat.deleted.channel", {
            channel: channel,
        });
    }

    ban_user(channel: string, username: string) {
        //this.server.emit("banUser", {
        //    channel: channel,
        //    username: username,
        //});
        //return username;
    }

    kick_user(channelName: string, username: string) {
        //this.server.emit("kickUser", {
        //    channel: channelName,
        //    username: username,
        //});
    }

    async send_unmute_or_unban(
        channel: string,
        users_list: string[],
        target_list: string[],
        status: string
    ) {
        //for (let i = 0; i < target_list.length; i++) {
        //    let socket = this.server.sockets.sockets.get(target_list[i]);
        //    if (socket) {
        //        socket.emit("unban/unmute", {
        //            status: status,
        //            channel: channel,
        //            users_list: users_list,
        //        });
        //    }
        //}
    }

    async set_admin(
        admin_list: string[],
        target_list: string[],
        channel_name: string
    ) {
        //for (let i = 0; i < target_list.length; i++) {
        //    let socket = this.server.sockets.sockets.get(target_list[i]);
        //    if (socket) {
        //        socket.emit("UpdateAdmin", {
        //            channel_name: channel_name,
        //            admin_list: admin_list,
        //        });
        //    }
        //}
    }

    updateChannelAdmin(username: string, channel: string, value: boolean) {
        //this.server.emit("channelAdminUpdate", {
        //    username: username,
        //    channel: channel,
        //    value: value,
        //});
    }

    leave_privateChannel(username: string, channelName: string) {
        this.server.emit("userLeaveChannel", {
            username: username,
            channel: channelName,
        });
    }
}
