import { useContext } from "react";
import { GameContext } from "../../../contexts/GameProvider";
import "../../../styles/JoinGame.css";

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
                    New game
                </button>
                <button onClick={() => game.setMenu("JoinGame")}>Exit</button>
            </div>
        </div>
    );
};

export default Results;
