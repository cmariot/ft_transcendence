import { useContext, useState } from "react";
import { GameContext } from "../../../contexts/GameProvider";
import "../../../styles/JoinGame.css";
import axios from "axios";
import { MenuContext } from "../../../contexts/MenuProviders";

const GameOptions = () => {
    const game = useContext(GameContext);
    const menu = useContext(MenuContext);

    const [power_up, setPowerUp] = useState(false);
    const [different_map, setDifferentMap] = useState(false);

    async function joinGame() {
        try {
            const joinResponse = await axios.post("/api/game/queue", {
                power_up: power_up,
                different_map: different_map,
            });
            if (joinResponse.status === 201) {
                game.setMenu("WaitingScreen");
            }
        } catch (error: any) {
            menu.displayError(error.response.data.message);
        }
    }

    return (
        <div id="game-options">
            <div id="options-checkbox">
                <div>
                    <label>
                        Solo
                        <input
                            type="checkbox"
                            checked={different_map}
                            id="input-double-auth"
                            onChange={() =>
                                setDifferentMap((prevState) => !prevState)
                            }
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Power-up
                        <input
                            type="checkbox"
                            checked={power_up}
                            id="input-double-auth"
                            onChange={() =>
                                setPowerUp((prevState) => !prevState)
                            }
                        />
                    </label>
                </div>
            </div>
            <div>
                <button onClick={() => joinGame()}>play</button>
                <button onClick={() => game.setMenu("JoinGame")}>cancel</button>
            </div>
        </div>
    );
};

export default GameOptions;
