import { Injectable } from "@nestjs/common";
import { UsersService } from "../../users/services/users.service";

@Injectable()
export class SocketService {
    constructor(private userService: UsersService) {}

    async UserConnection(username: string, sockectID: string, status: string) {
        if (username && sockectID && status === "Online") {
            this.userService.setSocketID(username, sockectID, status);
        }
		if (sockectID && status === "Offline") {
            this.userService.userDisconnection(sockectID);
        }
    }
}
