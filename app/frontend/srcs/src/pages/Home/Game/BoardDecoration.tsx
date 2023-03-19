import { useContext } from "react";
import { GameContext } from "../../../contexts/GameProvider";

const BoardDecoration = () => {
    const game = useContext(GameContext);

    return (
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
    );
};

export default BoardDecoration;
