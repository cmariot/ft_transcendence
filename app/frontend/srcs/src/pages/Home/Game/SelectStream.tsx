import { useContext, useEffect } from "react";
import { GameContext } from "../../../contexts/GameProvider";
import "../../../styles/JoinGame.css";
import axios from "axios";
import { UserContext } from "../../../contexts/UserProvider";

const SelectStream = () => {
    const game = useContext(GameContext);

    async function cancel() {
        game.setMenu("JoinGame");
    }

    async function watchStream(match: {
        game_id: string;
        player1: string;
        player2: string;
    }) {
        console.log(match);
    }

    return (
        <div id="select-stream">
            <button onClick={() => cancel()}>cancel</button>
            {game.currentGames.length ? (
                <>
                    {game.currentGames.map((match, index) => (
                        <button key={index} onClick={() => watchStream(match)}>
                            {match.player1} vs {match.player2}
                        </button>
                    ))}
                </>
            ) : (
                <div id="no-channels">
                    <p>No stream available.</p>
                </div>
            )}
        </div>
    );
};

export default SelectStream;
