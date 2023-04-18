import { useContext } from "react";
import "../../../styles/test.css";
import BoardDecoration from "./BoardDecoration";
import axios from "axios";
import { GameContext } from "../../../contexts/game/GameContext";

const Stream = () => {
    const game = useContext(GameContext);

    function getBottom(paddlePos: number, paddle: number): number {
        var paddleHeigth: number;
        if (paddle === 1) {
            paddleHeigth = game.paddle1Heigth;
        } else {
            paddleHeigth = game.paddle2Heigth;
        }
        const percentage = (paddlePos / game.screenHeigth) * 100;
        return (
            percentage *
            ((game.screenHeigth - paddleHeigth) / game.screenHeigth)
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

    async function exitStream(game_id: string) {
        const watchResponse = await axios.post("/api/game/leaveStream", {
            game_id: game_id,
        });
        if (watchResponse.status === 201) {
            game.setMenu("SelectStream");
        }
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
                    {game.p1Power !== "" && <p>Power : {game.p1Power}</p>}
                </div>
                <div className="score">
                    <h2>{game.p2Name}</h2>
                    <h3>{game.p2Score}</h3>
                    {game.p2Power !== "" && <p>Power : {game.p2Power}</p>}
                </div>
            </div>
            <BoardDecoration />
            <button
                style={{
                    position: "absolute",
                    bottom: "5px",
                }}
                onClick={() => exitStream(game.gameID)}
            >
                exit
            </button>
            <div
                id="paddle1"
                className="paddle"
                style={{
                    height: `${
                        (game.paddle1Heigth / game.screenHeigth) * 100
                    }%`,
                    width: `${(game.paddleWidth / game.screenWidth) * 100}%`,
                    left: `${(game.paddleOffset / game.screenWidth) * 100}%`,
                    bottom: `${getBottom(game.paddle1, 1)}%`,
                }}
            />
            <div
                className="ball"
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
                    height: `${
                        (game.paddle2Heigth / game.screenHeigth) * 100
                    }%`,
                    width: `${(game.paddleWidth / game.screenWidth) * 100}%`,
                    right: `${(game.paddleOffset / game.screenWidth) * 100}%`,
                    bottom: `${getBottom(game.paddle2, 2)}%`,
                }}
            />
            {game.powerUps.map((power_up, index) => (
                <div
                    key={index}
                    className="ball"
                    style={{
                        height: `${
                            (game.ballHeigth / game.screenHeigth) * 100
                        }%`,
                        width: `${(game.ballWidth / game.screenWidth) * 100}%`,
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

export default Stream;
