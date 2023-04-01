import { useContext } from "react";
import "../../../styles/JoinGame.css";
import { GameContext } from "../../../contexts/game/GameContext";

const StreamResults = () => {
    const game = useContext(GameContext);

    function close() {
        game.setMenu("SelectStream");
    }

    return (
        <div>
            <h2>{game.streamResults.winner} won the game !</h2>
            <div id="player-names">
                <div className="score">
                    <h2>{game.streamResults.player1}</h2>
                    <h3>{game.streamResults.p1Score}</h3>
                </div>
                <div className="score">
                    <h2>{game.streamResults.player2}</h2>
                    <h3>{game.streamResults.p2Score}</h3>
                </div>
            </div>
            <button onClick={() => close()}>close</button>
        </div>
    );
};

export default StreamResults;
