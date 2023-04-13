import { useContext } from "react";
import "../../../styles/JoinGame.css";
import { GameContext } from "../../../contexts/game/GameContext";

const Results = () => {
    const game = useContext(GameContext);

    function winnerName() {
        return game.p1Score > game.p2Score ? game.p1Name : game.p2Name;
    }

    return (
        <div>
            <h2>{winnerName()} won the game !</h2>
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
            <div>
                <button onClick={() => game.setMenu("GameOptions")}>
                    new game
                </button>
                <button onClick={() => game.setMenu("JoinGame")}>exit</button>
            </div>
        </div>
    );
};

export default Results;
