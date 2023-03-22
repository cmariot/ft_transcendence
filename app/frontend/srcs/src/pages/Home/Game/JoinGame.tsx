import { useContext } from "react";
import { GameContext } from "../../../contexts/GameProvider";
import "../../../styles/JoinGame.css";
import axios from "axios";

const JoinGame = () => {
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

    async function rules() {
        game.setMenu("Rules");
    }

    return (
        <div id="join-game">
            <p>Click on the button for matchmaking</p>
            <button onClick={() => joinGame()}>play</button>
            <button onClick={() => rules()}>how to play</button>
        </div>
    );
};

export default JoinGame;
