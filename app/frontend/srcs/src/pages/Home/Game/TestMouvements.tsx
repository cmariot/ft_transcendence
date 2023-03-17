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
        const initial = (paddlePos / game.screenHeigth) * 100;
        return (
            initial *
            ((game.screenHeigth - game.paddleHeigth) / game.screenHeigth)
        );
    }

    function getBallLeft(): number {
        const initial = (game.ball.x / game.screenWidth) * 100;
        const ballRadius = getBallRadius();
        return (
            initial * ((game.screenWidth - ballRadius * 2) / game.screenWidth)
        );
    }

    function getBallRadius() {
        const board = document.getElementById("board");
        if (board) {
            return (board.offsetWidth / game.screenWidth) * game.ballRadius;
        }
        return (game.screenWidth / game.screenWidth) * game.ballRadius;
    }

    function getBallBottom(): number {
        const ballRadius = getBallRadius();
        const initial = (game.ball.y / game.screenHeigth) * 100;
        return initial * ((game.screenHeigth - ballRadius) / game.screenHeigth);
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
                    ball: x = {Math.round(game.ball.x)}, y ={" "}
                    {Math.round(game.ball.y)}
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
                    height: `${getBallRadius()}px`,
                    width: `${getBallRadius()}px`,
                    left: `${getBallLeft()}%`,
                    bottom: `${getBallBottom()}%`,
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
