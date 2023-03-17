import { Injectable } from "@nestjs/common";
import { Server } from "socket.io";
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { PositionInterface } from "src/game/services/game.service";

@Injectable()
@WebSocketGateway(3001, { cors: { origin: "https://localhost:8443" } })
export class GameGateway {
    @WebSocketServer()
    server: Server;

    // Change the app menu in the frontend
    async updateFrontMenu(player1: string, player2: string, menu: string) {
        let room = [player1, player2];
        this.server.to(room).emit("game.menu.change", { menu: menu });
    }

    // 5, 4, 3, 2, 1
    async updateCountDown(
        player1: string,
        player2: string,
        menu: string,
        countDown: number
    ) {
        let room = [player1, player2];
        this.server
            .to(room)
            .emit("game.menu.change", { menu: menu, countDown: countDown });
    }

    // Send the game elements position
    async sendPos(player1: string, player2: string, pos: PositionInterface) {
        let room = [player1, player2];
        this.server.to(room).emit("game.pos.update", pos);
    }

    // Share the game uuid with the players
    async sendGameID(player1: string, player2: string, ID: string) {
        let room = [player1, player2];
        this.server.to(room).emit("game.name", ID);
    }

    async sendCancel(socketId: string, status: string) {
        //this.server.to(socketId).emit("gameStatus", {
        //    status: "Cancel",
        //});
    }

    async sendInvitation(socketId: string, hostID: string) {
        //this.server.to(socketId).emit("gameInvitation", { host: hostID });
    }

    async sendEndGameStatus(
        socketId: string,
        status: string,
        victory: boolean
    ) {
        //this.server.to(socketId).emit("EndGameStatus", {
        //    status: status,
        //    victory: victory,
        //});
    }
}
