import { useContext, useEffect } from "react";
import { GameContext } from "../../../contexts/GameProvider";
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

    function getBottom(paddlePos: number): number {
        let initial = (paddlePos / game.screenHeigth) * 100;
        let paddle = (game.paddleHeigth / game.screenHeigth) * 100;
        return (initial / 100) * (initial - paddle);
    }

    return (
        <div id="board">
            <div>
                <p>gameID: {game.gameID}</p>
                <p>
                    paddle2: {game.paddle1} / {getBottom(game.paddle1)}
                </p>
                <p>
                    paddle2: {game.paddle2} / {getBottom(game.paddle2)}
                </p>
                <p>
                    ball: x = {game.ball.x}, y = {game.ball.y}
                </p>
            </div>
            <div
                id="paddle1"
                className="paddle"
                style={{
                    height: `${(game.paddleHeigth / game.screenHeigth) * 100}%`,
                    width: `${(game.paddleWidth / game.screenWidth) * 100}%`,
                    left: `${(game.paddleOffset / game.screenWidth) * 100}%`,
                    bottom: `${getBottom(game.paddle1)}%`,
                }}
            />
            <div
                id="ball"
                style={{
                    height: "0px",
                    width: "0px",
                }}
            />
            <div
                id="paddle2"
                className="paddle"
                style={{
                    height: `${(game.paddleHeigth / game.screenHeigth) * 100}%`,
                    width: `${(game.paddleWidth / game.screenWidth) * 100}%`,
                    right: `${(game.paddleOffset / game.screenWidth) * 100}%`,
                    bottom: `${getBottom(game.paddle2)}%`,
                }}
            />
        </div>
    );
};

export default TestMouvements;
