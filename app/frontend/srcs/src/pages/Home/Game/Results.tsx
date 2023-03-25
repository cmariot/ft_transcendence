import { useContext } from "react";
import { GameContext } from "../../../contexts/GameProvider";
import "../../../styles/JoinGame.css";
import axios from "axios";
import { MenuContext } from "../../../contexts/MenuProviders";

const Results = () => {
    const game = useContext(GameContext);
    const menu = useContext(MenuContext);

    function winnerName() {
        return game.p1Score > game.p2Score ? game.p1Name : game.p2Name;
    }

    async function joinGame() {
        try {
            const joinResponse = await axios.post("/api/game/queue");
            if (joinResponse.status === 201) {
                game.setMenu("WaitingScreen");
            }
        } catch (error: any) {
            menu.displayError(error.response.data.message);
        }
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
            <button onClick={() => joinGame()}>New game</button>
        </div>
    );
};

export default Results;
