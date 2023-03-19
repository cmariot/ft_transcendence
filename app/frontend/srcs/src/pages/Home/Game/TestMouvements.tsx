import { useContext, useEffect } from "react";
import { GameContext } from "../../../contexts/GameProvider";
import { SocketContext } from "../../../contexts/SocketProvider";
import "../../../styles/test.css";

const TestMouvements = () => {
    const socket = useContext(SocketContext);
    const game = useContext(GameContext);

    function handleKeyPress(event: any) {
        console.log(game);
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
        const percentage = (paddlePos / game.screenHeigth) * 100;
        return (
            percentage *
            ((game.screenHeigth - game.paddleHeigth) / game.screenHeigth)
        );
    }

    function getBallBottom(): number {
        const percentage = (game.ball.y / game.screenHeigth) * 100;
        return (
            percentage *
            ((game.screenHeigth - game.ballHeigth) / game.screenHeigth)
        );
    }

    function getBallLeft(): number {
        const percentage = (game.ball.x / game.screenWidth) * 100;
        return (
            percentage *
            ((game.screenWidth - game.ballWidth) / game.screenWidth)
        );
    }

    return (
        <div id="board">
            <div>
                <div id="player-names">
                    <div className="score">
                        <h2>{game.p1Name}</h2>
                        <h3>{game.p1Score}</h3>
                    </div>
                    <div className="score">
                        <h2>{game.p2Name}</h2>
                        <h3>{game.p2Score}</h3>
                    </div>
                </div>
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

            <div id="board-decoration">
                <div id="middle" />
                <div
                    className="edges"
                    style={{
                        top: `50%`,
                        border: "0.5px solid #737373",
                        width: "100%",
                    }}
                />
                <div
                    className="edges"
                    style={{
                        left: `${(game.ballWidth / game.screenWidth) * 100}%`,
                        border: "0.5px solid #737373",
                        height: "100%",
                    }}
                />
                <div
                    className="edges"
                    style={{
                        right: `${(game.ballWidth / game.screenWidth) * 100}%`,
                        border: "0.5px solid #737373",
                        height: "100%",
                    }}
                />
                <div
                    className="edges"
                    style={{
                        bottom: `0%`,
                        border: "0.5px solid #737373",
                        height: "100%",
                    }}
                />
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
                    height: `${(game.ballHeigth / game.screenHeigth) * 100}%`,
                    width: `${(game.ballWidth / game.screenWidth) * 100}%`,
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
