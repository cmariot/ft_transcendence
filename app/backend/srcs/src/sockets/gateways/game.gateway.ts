import { Injectable } from "@nestjs/common";
import { Server } from "socket.io";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { GameInterface } from "src/game/interfaces/game.interface";
import { games } from "src/game/services/game.service";

@Injectable()
@WebSocketGateway(3001, { cors: { origin: "https://localhost:8443" } })
export class GameGateway {
    @WebSocketServer()
    server: Server;

    // Change the app menu in the frontend
    async changeFrontMenu(socketID: string, menu: string) {
        this.server.to(socketID).emit("game.menu.change", { menu: menu });
    }

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
    async sendPos(
        player1: string,
        player2: string,
        pos: GameInterface,
        game_id: string
    ) {
        let room = [player1, player2];
        this.server.to(room).emit("game.pos.update", pos);
        let match: GameInterface = games.get(game_id);
        if (!match) {
            return;
        }
        this.server.to(match.watchersSockets).emit("game.pos.update", pos);
    }

    // Share the game uuid with the players
    async sendGameID(
        player1: string,
        player2: string,
        ID: string,
        game: GameInterface
    ) {
        let room = [player1, player2];
        this.server.to(room).emit("game.name", ID);
        this.server.to(game.watchersSockets).emit("game.name", ID);

        this.server.emit("game.start", {
            game_id: ID,
            player1: game.player1Username,
            player2: game.player2Username,
        });
    }

    // Send the match results and their new leaderboard rank to the players
    emitGameResults(
        player1Socket: string,
        player2Socket: string,
        match: GameInterface,
        player1Rank: number,
        player2Rank: number
    ) {
        let p1Winner = match.player1Score > match.player2Score ? true : false;
        let data: {};
        if (p1Winner) {
            data = {
                winner: match.player1Username,
                loser: match.player2Username,
                winner_score: match.player1Score,
                loser_score: match.player2Score,
                rank: player1Rank,
            };
            this.server.to(player1Socket).emit("game.results", data);
            data = {
                winner: match.player1Username,
                loser: match.player2Username,
                winner_score: match.player1Score,
                loser_score: match.player2Score,
                rank: player2Rank,
            };
            this.server.to(player2Socket).emit("game.results", data);
        } else {
            data = {
                winner: match.player2Username,
                loser: match.player1Username,
                winner_score: match.player2Score,
                loser_score: match.player1Score,
                rank: player1Rank,
            };
            this.server.to(player1Socket).emit("game.results", data);
            data = {
                winner: match.player2Username,
                loser: match.player1Username,
                winner_score: match.player2Score,
                loser_score: match.player1Score,
                rank: player2Rank,
            };
            this.server.to(player2Socket).emit("game.results", data);
        }
    }

    async emitEndGame(game_id: string, match: GameInterface) {
        this.server.emit("game.end", {
            game_id: game_id,
            player1: match.player1Username,
            player2: match.player2Username,
        });
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
