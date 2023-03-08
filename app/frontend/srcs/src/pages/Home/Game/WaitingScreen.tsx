import { useContext } from "react";
import { GameContext } from "../../../Contexts/GameProvider";
import "../../../styles/JoinGame.css";
import axios from "axios";
import { UserContext } from "../../../Contexts/UserProvider";

const WaitingScreen = () => {
    const game = useContext(GameContext);
    const user = useContext(UserContext);

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
        <div id="waiting-screen">
            <button onClick={() => cancelGame()}>cancel</button>
        </div>
    );
};

export default WaitingScreen;
