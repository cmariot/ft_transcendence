import { useContext } from "react";
import { GameContext } from "../../../contexts/GameProvider";
import JoinGame from "./JoinGame";
import WaitingScreen from "./WaitingScreen";
import CountDown from "./CountDown";
import TestMouvements from "./TestMouvements";
import Disconnection from "./Disconnection";

const Game = () => {
    const game = useContext(GameContext);

    return (
        <div id="game">
            {game.menu === "JoinGame" && <JoinGame />}
            {game.menu === "WaitingScreen" && <WaitingScreen />}
            {game.menu === "countDown" && <CountDown time={game.countDown} />}
            {game.menu === "Game" && <TestMouvements />}
            {game.menu === "Disconnection" && <Disconnection />}
        </div>
    );
};

export default Game;
