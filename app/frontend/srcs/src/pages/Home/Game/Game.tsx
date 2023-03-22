import { useContext } from "react";
import { GameContext } from "../../../contexts/GameProvider";
import JoinGame from "./JoinGame";
import WaitingScreen from "./WaitingScreen";
import CountDown from "./CountDown";
import TestMouvements from "./TestMouvements";
import Disconnection from "./Disconnection";
import Results from "./Results";
import Rules from "./Rules";
import SelectStream from "./SelectStream";

const Game = () => {
    const game = useContext(GameContext);

    return (
        <div id="game">
            {game.menu === "JoinGame" && <JoinGame />}
            {game.menu === "Rules" && <Rules />}
            {game.menu === "WaitingScreen" && <WaitingScreen />}
            {game.menu === "countDown" && <CountDown time={game.countDown} />}
            {game.menu === "Game" && <TestMouvements />}
            {game.menu === "Disconnection" && <Disconnection />}
            {game.menu === "Results" && <Results />}
            {game.menu === "SelectStream" && <SelectStream />}
        </div>
    );
};

export default Game;
