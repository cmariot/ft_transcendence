import { useContext } from "react";
import { GameContext } from "../../../contexts/GameProvider";
import "../../../styles/JoinGame.css";
import axios from "axios";
import { UserContext } from "../../../contexts/UserProvider";

const JoinGame = () => {
    const game = useContext(GameContext);
    const user = useContext(UserContext);

    async function joinGame() {
        try {
            const joinResponse = await axios.post("/api/game/queue", {
                username: user.username,
            });
            if (joinResponse.status === 201) {
                console.log(game);
                game.setMenu("WaitingScreen");
            }
        } catch (error: any) {
            alert(error.response.data.message);
        }
    }

    async function cancelGame() {
        try {
            const cancelResponse = await axios.post("/api/game/queue/cancel", {
                username: user.username,
            });
            if (cancelResponse.status === 201) {
                game.setMenu("JoinGame");
            }
        } catch (error: any) {
            alert(error.response.data.message);
        }
    }

    return (
        <div id="join-game">
            <p>Click on the button for matchmaking</p>
            <button onClick={() => joinGame()}>Play</button>
            <button onClick={() => cancelGame()}>cancel</button>
        </div>
    );
};

export default JoinGame;
