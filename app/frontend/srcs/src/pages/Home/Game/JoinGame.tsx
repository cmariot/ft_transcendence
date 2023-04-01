import { useContext } from "react";
import "../../../styles/JoinGame.css";
import { GameContext } from "../../../contexts/game/GameContext";

const JoinGame = () => {
    const game = useContext(GameContext);

    async function rules() {
        game.setMenu("Rules");
    }

    async function selectStream() {
        game.setMenu("SelectStream");
    }

    return (
        <div id="join-game">
            <p>Click on the button for matchmaking</p>
            <div>
                <button onClick={() => game.setMenu("GameOptions")}>
                    play
                </button>
                <button onClick={() => selectStream()}>stream</button>
            </div>
            <button onClick={() => rules()}>how to play</button>
        </div>
    );
};

export default JoinGame;
