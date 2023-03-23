import { useContext } from "react";
import { GameContext } from "../../../contexts/GameProvider";
import "../../../styles/JoinGame.css";

const StreamResults = () => {
    const game = useContext(GameContext);

    function close() {
        game.setMenu("SelectStream");
    }

    return (
        <div>
            <h2>
                {game.p1Score > game.p2Score ? game.p1Name : game.p2Name} won
                the game !
            </h2>
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
            <button onClick={() => close()}>close</button>
        </div>
    );
};

export default StreamResults;
