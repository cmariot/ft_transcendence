import { useContext } from "react";
import { GameContext } from "../../../contexts/GameProvider";
import axios from "axios";

const Disconnection = () => {
    const game = useContext(GameContext);

    async function joinGame() {
        try {
            const joinResponse = await axios.post("/api/game/queue");
            if (joinResponse.status === 201) {
                game.setMenu("WaitingScreen");
            }
        } catch (error: any) {
            alert(error.response.data.message);
        }
    }

    async function cancel() {
        game.setMenu("JoinGame");
    }

    return (
        <div id="join-game">
            <h3>
                Your opponent is disconnected,
                <br />
                so your game has been cancelled.
            </h3>
            <div>
                <button onClick={() => joinGame()}>Play</button>
                <button onClick={() => cancel()}>cancel</button>
            </div>
        </div>
    );
};

export default Disconnection;
