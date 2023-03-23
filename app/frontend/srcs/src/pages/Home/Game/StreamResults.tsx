import { useContext } from "react";
import { GameContext } from "../../../contexts/GameProvider";
import "../../../styles/JoinGame.css";
import axios from "axios";

const StreamResults = () => {
    const game = useContext(GameContext);

    const winner = game.p1Score > game.p2Score ? game.p1Name : game.p2Name;
    const player1 = game.p1Name;
    const player2 = game.p2Name;
    const player1Score = game.p1Score;
    const player2Score = game.p2Score;

    async function close() {
        game.setMenu("SelectStream");
    }

    return (
        <div>
            <h2>{winner} won the game !</h2>
            <div id="player-names">
                <div className="score">
                    <h2>{player1}</h2>
                    <h3>{player1Score}</h3>
                </div>
                <div className="score">
                    <h2>{player2}</h2>
                    <h3>{player2Score}</h3>
                </div>
            </div>
            <button onClick={() => close()}>close</button>
        </div>
    );
};

export default StreamResults;
