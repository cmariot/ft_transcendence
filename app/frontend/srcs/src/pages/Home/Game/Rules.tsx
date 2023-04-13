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
            <h1>Pong Rules</h1>
            <h2>Basic</h2>
            <p>Move your paddle with the arrow <b>up</b> and arrow <b>down</b> keys.</p>
            <p>If your opponent doesn't hit the ball, you mark a point.</p>
            <p>You are the winner if you have <b>15 points.</b></p>

            <h2>Bonus</h2>
            <p>Solo game is meant to train against an unbeatable AI.</p>
            <p>Power ups are special powers, press <b>Space</b> in order to use.</p>
            <button onClick={() => ok()}>got it</button>
        </div>
    );
};

export default Rules;
