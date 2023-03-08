import { useContext } from "react";
import { GameContext } from "../../../Contexts/GameProvider";
import JoinGame from "./JoinGame";
import WaitingScreen from "./WaitingScreen";

const Game = () => {
    const game = useContext(GameContext);

    return (
        <div id="game">
            {game.menu === "JoinGame" && <JoinGame />}
            {game.menu === "WaitingScreen" && <WaitingScreen />}
        </div>
    );
};

export default Game;
