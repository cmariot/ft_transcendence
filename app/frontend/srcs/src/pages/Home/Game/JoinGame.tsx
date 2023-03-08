import { useContext } from "react";
import { GameContext } from "../../../Contexts/GameProvider";
import "../../../styles/JoinGame.css";
import axios from "axios";
import { UserContext } from "../../../Contexts/UserProvider";

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

    return (
        <div id="join-game">
            <p>Click on the button for matchmaking</p>
            <button onClick={() => joinGame()}>Play</button>
        </div>
    );
};

export default JoinGame;
