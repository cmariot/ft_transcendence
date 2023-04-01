import { useContext } from "react";
import "../../../styles/JoinGame.css";
import axios from "axios";
import { GameContext } from "../../../contexts/game/GameContext";
import { UserContext } from "../../../contexts/user/UserContext";
import { MenuContext } from "../../../contexts/menu/MenuContext";

const WaitingScreen = () => {
    const game = useContext(GameContext);
    const user = useContext(UserContext);
    const menu = useContext(MenuContext);

    async function cancelGame() {
        try {
            const cancelResponse = await axios.post("/api/game/queue/cancel", {
                username: user.username,
            });
            if (cancelResponse.status === 201) {
                game.setMenu("JoinGame");
            }
        } catch (error: any) {
            menu.displayError(error.response.data.message);
        }
    }

    return (
        <div id="waiting-screen">
            <p>Searching for a player ...</p>
            <progress value={undefined} />
            <button onClick={() => cancelGame()}>cancel</button>
        </div>
    );
};

export default WaitingScreen;
