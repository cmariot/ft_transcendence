import { useContext } from "react";
import { GameContext } from "../../../contexts/game/GameContext";

const Disconnection = () => {
    const game = useContext(GameContext);

    return (
        <div id="join-game">
            <h3>
                Your opponent is disconnected,
                <br />
                so your game has been cancelled.
            </h3>
            <div>
                <button onClick={() => game.setMenu("GameOptions")}>
                    Play
                </button>
                <button onClick={() => game.setMenu("JoinGame")}>cancel</button>
            </div>
        </div>
    );
};

export default Disconnection;
