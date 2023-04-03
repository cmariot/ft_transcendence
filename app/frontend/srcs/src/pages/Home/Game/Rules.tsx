import { useContext } from "react";
import "../../../styles/JoinGame.css";
import { GameContext } from "../../../contexts/game/GameContext";

const Rules = () => {
    const game = useContext(GameContext);

    async function ok() {
        game.setMenu("GameOptions");
    }

    return (
        <div id="join-game">
            <p>Move your paddle with the arrow up and arrow down keys.</p>
            <p>If your opponent doesn't hit the ball, you marks a point.</p>
            <p>You are the winner if you have 15 points.</p>
            <button onClick={() => ok()}>got it</button>
        </div>
    );
};

export default Rules;
