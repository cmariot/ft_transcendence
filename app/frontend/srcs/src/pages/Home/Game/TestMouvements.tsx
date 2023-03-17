import { useContext, useEffect } from "react";
import { GameContext } from "../../../contexts/GameProvider";
import JoinGame from "./JoinGame";
import WaitingScreen from "./WaitingScreen";
import { Board } from "./Board";
import CountDown from "./CountDown";
import { SocketAddress } from "net";
import { SocketContext } from "../../../contexts/SocketProvider";
import "../../../styles/test.css";

const TestMouvements = () => {
    const socket = useContext(SocketContext);
    const game = useContext(GameContext);

    function handleKeyPress(event: any) {
        if (event.key === "ArrowUp") {
            socket.emit("up", { gameID: game.gameID });
        } else if (event.key === "ArrowDown") {
            socket.emit("down", { gameID: game.gameID });
        }
    }

    useEffect(() => {
        document.addEventListener("keydown", handleKeyPress);
        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    });

    function heightPaddle(initial: number): number {
        return initial - (initial / 100) * 10;
    }

    function heightBall(initial: number): number {
        return initial;
    }

    function leftBall(initial: number): number {
        return initial;
    }

    return (
        <div id="board">
            <div>
                <p>gameID: {game.gameID}</p>
                <p>paddle1: {game.paddle1}</p>
                <p>paddle2: {game.paddle2}</p>
                <p>
                    ball: x = {game.ball.x}, y = {game.ball.y}
                </p>
            </div>

            <div
                id="paddle1"
                className="paddle"
                style={{
                    bottom: `${heightPaddle(game.paddle1)}%`,
                    height: "10%",
                    width: "2.5%",
                }}
            />
            <div
                id="ball"
                style={{
                    left: `${leftBall(game.ball.x)}%`,
                    bottom: `${heightBall(game.ball.y)}%`,
                    height: "1.5vh",
                    width: "1.5vh",
                }}
            />
            <div
                id="paddle2"
                className="paddle"
                style={{
                    bottom: `${heightPaddle(game.paddle2)}%`,
                    height: "10%",
                    width: "2.5%",
                }}
            />
        </div>
    );
};

export default TestMouvements;
