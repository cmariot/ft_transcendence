import { Vector } from "vecti";

export interface GameInterface {
    uuid: string;
    player1Username: string;
    player2Username: string;
    sockets: string[];
    player1Socket: string[];
    player2Socket: string[];
    player1Position: number;
    player2Position: number;
    ballPosition: Vector;
    ballDirection: Vector;
    ballSpeed: number;
    player1Score: number;
    player2Score: number;
    screenHeigth: number;
    screenWidth: number;
    paddleHeigth: number;
    paddleWidth: number;
    paddleOffset: number;
    ballWidth: number;
    ballHeigth: number;
    disconnection: boolean;
    lose: boolean;
    watchersSockets: string[];
    power_up: boolean;
    different_map: boolean;
}
