import { Injectable } from "@nestjs/common";
import { UsersService } from "../../users/services/users.service";

@Injectable()
export class SocketService {
    constructor(private userService: UsersService) {}

    async UserConnection(username: string, sockectID: string, status: string): Promise<string>{
		let user;
        if (username && sockectID && status === "Online") {
            user = await this.userService.setSocketID(username, sockectID, status);
        }
		if (sockectID && status === "Offline") {
            user = await this.userService.userDisconnection(sockectID);
        }
		if (sockectID && status === "In_Game") {
            user = await this.userService.setStatus(sockectID, status);
        }
		if (sockectID && status === "MatchMaking") {
            user = await this.userService.setStatus(sockectID, status);
        }
		console.log("Status : ", user, status);
		return (user);
    }
}
