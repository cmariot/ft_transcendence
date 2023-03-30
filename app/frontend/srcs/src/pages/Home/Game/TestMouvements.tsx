import { useContext, useEffect } from "react";
import { GameContext } from "../../../contexts/GameProvider";
import { SocketContext } from "../../../contexts/SocketProvider";
import "../../../styles/test.css";
import BoardDecoration from "./BoardDecoration";

const TestMouvements = () => {
    const socket = useContext(SocketContext);
    const game = useContext(GameContext);

    function handleKeyPress(event: KeyboardEvent) {
        event.preventDefault();
        if (event.key === "ArrowUp") {
            socket.emit("up", { gameID: game.gameID });
        } else if (event.key === "ArrowDown") {
            socket.emit("down", { gameID: game.gameID });
        } else if (event.key === " ") {
            socket.emit("powerUp", { gameID: game.gameID });
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

    function getPowerUpBottom(y: number): number {
        const percentage = (y / game.screenHeigth) * 100;
        return (
            percentage *
            ((game.screenHeigth - game.ballHeigth) / game.screenHeigth)
        );
    }

    function getPowerUpLeft(x: number): number {
        const percentage = (x / game.screenWidth) * 100;
        return (
            percentage *
            ((game.screenWidth - game.ballWidth) / game.screenWidth)
        );
    }

    return (
        <div id="board">
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
            <BoardDecoration />
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
            {game.powerUps.length > 0 &&
                game.powerUps.map((power_up, index) => (
                    <div
                        key={index}
                        id="ball"
                        style={{
                            height: `${
                                (game.ballHeigth / game.screenHeigth) * 100
                            }%`,
                            width: `${
                                (game.ballWidth / game.screenWidth) * 100
                            }%`,
                            left: `${getPowerUpLeft(power_up.position.x)}%`,
                            bottom: `${getPowerUpBottom(power_up.position.y)}%`,
                        }}
                    >
                        ?
                    </div>
                ))}
        </div>
    );
};

export default TestMouvements;
