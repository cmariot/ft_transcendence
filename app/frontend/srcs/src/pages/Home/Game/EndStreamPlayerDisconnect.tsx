import { useContext } from "react";
import { GameContext } from "../../../contexts/game/GameContext";

const EndStreamPlayerDisconnect = () => {
    const game = useContext(GameContext);

    async function cancel() {
        game.setMenu("SelectStream");
    }

    return (
        <div id="join-game">
            <h3>
                A player is disconnected,
                <br />
                so your game has been cancelled.
            </h3>
            <div>
                <button onClick={() => cancel()}>cancel</button>
            </div>
        </div>
    );
};

export default EndStreamPlayerDisconnect;
