import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { UsersService } from "src/users/services/users.service";
import { UserEntity } from "src/users/entity/user.entity";
import { games } from "src/game/services/game.service";
import { MatchmakingService } from "src/game/services/matchmaking.service";

@Injectable()
@WebSocketGateway(3001, {
    cors: { origin: process.env.HOST },
})
export class StatusGateway {
    constructor(
        private userService: UsersService,
        private matchmakingService: MatchmakingService
    ) {}

    @WebSocketServer()
    server: Server;

    // A la connexion d'un utilisateur
    @SubscribeMessage("user.login")
    async handleLogin(
        @MessageBody() data: { username: string },
        @ConnectedSocket() client: Socket
    ) {
        let user: UserEntity | null = await this.userService.getByUsername(
            data.username
        );
        if (!user) {
            throw new UnauthorizedException("User not found.");
        }
        for (let i = 0; i < user.socketId.length; i++) {
            if (user.socketId[i] !== client.id) {
                this.server
                    .to(user.socketId[i])
                    .emit("user.disconnect", { socket: user.socketId[i] });
            }
        }
        await this.userService.login(user.uuid, new Array<string>(client.id));
        client.join("online_users");
        https: this.sendStatus(data.username, "online");
    }

    // Disconnect an user in the frontend
    async disconnect(user: UserEntity, clientID: string) {
        for (let i = 0; i < user.socketId.length; i++) {
            if (user.socketId[i] !== clientID) {
                this.server.to(user.socketId[i]).emit("user.disconnect");
            }
        }
        await this.userService.logout(user.uuid);
        let socket = this.server.sockets.sockets.get(clientID);
        if (socket) {
            socket.leave("online_users");
        }
        this.sendStatus(user.username, "offline");
    }

    // A la deconnexion d'un utilisateur
    @SubscribeMessage("user.logout")
    async handleLogout(
        @MessageBody() data: { username: string },
        @ConnectedSocket() client: Socket
    ) {
        const user: UserEntity | null = await this.userService.getByUsername(
            data.username
        );
        if (user) {
            await this.matchmakingService.userDisconnection(user, true);
            await this.disconnect(user, client.id);
        }
    }

    // A la deconnexion d'un client
    async handleDisconnect(client: Socket) {
        let user: UserEntity | null = await this.userService.getBySocket(
            client.id
        );
        if (user) {
            await this.matchmakingService.userDisconnection(user, true);
            await this.disconnect(user, client.id);
        }
    }

    // Envoyer un event de changement de status
    sendStatus(username: string, status: string) {
        this.server.emit("status.update", {
            username: username,
            status: status,
        });
    }

    // When an user press KeyUp
    @SubscribeMessage("down")
    async moveDown(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { gameID: string }
    ) {
        let match = games.get(data.gameID);
        if (match) {
            if (
                match.freeze1 === false &&
                match.player1Socket.findIndex(
                    (element) => element === client.id
                ) !== -1
            ) {
                if (match.player1Position > 0) {
                    match.player1Position -= match.screenHeigth / 10;
                }
            } else if (
                match.freeze2 === false &&
                match.player2Socket.findIndex(
                    (element) => element === client.id
                ) !== -1
            ) {
                if (match.player2Position > 0) {
                    match.player2Position -= match.screenHeigth / 10;
                }
            }
            games.set(data.gameID, match);
        }
    }

    // When an user press KeyUp
    @SubscribeMessage("up")
    async moveUp(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { gameID: string }
    ) {
        let match = games.get(data.gameID);
        if (match) {
            if (
                match.freeze1 === false &&
                match.player1Socket.findIndex(
                    (element) => element === client.id
                ) !== -1
            ) {
                if (match.player1Position < match.screenHeigth) {
                    match.player1Position += match.screenHeigth / 10;
                }
            } else if (
                match.freeze2 === false &&
                match.player2Socket.findIndex(
                    (element) => element === client.id
                ) !== -1
            ) {
                if (match.player2Position < match.screenHeigth) {
                    match.player2Position += match.screenHeigth / 10;
                }
            }
            games.set(data.gameID, match);
        }
    }

    @SubscribeMessage("powerUp")
    async usePowerUp(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { gameID: string }
    ) {
        let match = games.get(data.gameID);
        if (match) {
            if (
                match.player1Socket.findIndex(
                    (element) => element === client.id
                ) !== -1
            ) {
                if (match.power_up_player1 !== "") {
                    match.player1_usePower = true;
                }
            } else if (
                match.player2Socket.findIndex(
                    (element) => element === client.id
                ) !== -1
            ) {
                if (match.power_up_player2 !== "") {
                    match.player2_usePower = true;
                }
            }
            games.set(data.gameID, match);
        }
    }
}
