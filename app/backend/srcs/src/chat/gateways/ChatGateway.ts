import { OnModuleInit } from "@nestjs/common";
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { SocketService } from "../services/socket.service";
@WebSocketGateway(3001, { cors: { origin: "http://frontend" } })
export class ChatGateway implements OnModuleInit {
	constructor(private socketService: SocketService) {}
    @WebSocketServer()
    server: Server;

    onModuleInit() {
        this.server.on("connection", (socket) => {
<<<<<<< HEAD
			socket.on("disconnect", () => {
				let username = this.socketService.UserDisconnetion(socket.id);
				this.server.emit("userStatus", {
            		message: "A user is disconnected",
            		username: username
        		});
=======
            console.log("new client connected to the app", socket.id);
            socket.on("disconnect", () => {
                console.log("client", socket.id, " disconnected");
                //this.userService.setUserStatus("OFFLINE", socket.id)
>>>>>>> 68f5bd4c548d3da9f3202504c8f62258c7331607
            });
        });
    }

<<<<<<< HEAD
    @SubscribeMessage("newChannelAvailable")
    onNewChannel(@MessageBody() data: any) {
        console.log("EMIT TO BROADCAST :");
        this.server.emit("onNewChannel", {
            message: "New Channel available",
=======
    //@SubscribeMessage("newChannelAvailable")
    newChannelAvailable(@MessageBody() data: any) {
        this.server.emit("newChannelAvailable", {
>>>>>>> 68f5bd4c548d3da9f3202504c8f62258c7331607
            content: data,
        });
    }

	@SubscribeMessage("userStatus")
    userStatus(@MessageBody() data: any) {
		console.log("RECEIVE: ", data);
		this.socketService.UserConnection(data.username, data.socket, data.status);
        return data;
    }
}
