import { useContext } from "react";
import { GameContext } from "../../../contexts/game/GameContext";

const BoardDecoration = () => {
    const game = useContext(GameContext);

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
        <div id="board-decoration">
            <div id="middle" />
            <div
                className="edges"
                style={{
                    bottom: `${
                        getBallBottom() +
                        (game.ballHeigth / game.screenHeigth / 2) * 100
                    }%`,
                    border: "0.5px solid #737373",
                    width: "100%",
                }}
            />
            <div
                className="edges"
                style={{
                    left: `${
                        getBallLeft() +
                        (game.ballWidth / game.screenWidth / 2) * 100
                    }%`,
                    border: "0.5px solid #737373",
                    height: "100%",
                }}
            />
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
    );
};

export default BoardDecoration;
