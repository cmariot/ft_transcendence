import { useContext, useEffect, useState } from "react";
import "../../../styles/JoinGame.css";
import { SocketContext } from "../../../contexts/sockets/SocketProvider";
import axios from "axios";
import { GameContext } from "../../../contexts/game/GameContext";

const SelectStream = () => {
    const game = useContext(GameContext);
    const socket = useContext(SocketContext);

    const [update, setUpdate] = useState(false);

    async function cancel() {
        game.setMenu("JoinGame");
    }

    async function watchStream(match: {
        game_id: string;
        player1: string;
        player2: string;
    }) {
        const watchResponse = await axios.post("/api/game/watch", {
            game_id: match.game_id,
        });
        if (watchResponse.status === 201) {
            game.setMenu("Stream");
        }
    }

    useEffect(() => {
        async function updateGamesList(data: {
            game_id: string;
            player1: string;
            player2: string;
        }) {
            let games = game.currentGames;
            let index = games.findIndex(
                (element) => element.game_id === data.game_id
            );
            if (index === -1) {
                games.push(data);
                game.setCurrentGames(games);
            }
            setUpdate((p) => !p);
        }
        socket.on("game.start", updateGamesList);
        return () => {
            socket.off("game.start", updateGamesList);
        };
    }, [game, socket]);

    useEffect(() => {
        async function updateGamesList(data: {
            game_id: string;
            player1: string;
            player2: string;
        }) {
            let games = game.currentGames;
            let index = games.findIndex(
                (element) => element.game_id === data.game_id
            );
            if (index !== -1) {
                games.splice(index, 1);
                game.setCurrentGames(games);
            }
            setUpdate((p) => !p);
        }
        socket.on("game.end", updateGamesList);
        return () => {
            socket.off("game.end", updateGamesList);
        };
    }, [game, socket]);

    return (
        <div id="select-stream">
            <button onClick={() => cancel()}>cancel</button>
            {game.currentGames.length ? (
                <div>
                    {game.currentGames.map((match, index) => (
                        <button key={index} onClick={() => watchStream(match)}>
                            {match.player1} vs {match.player2}
                        </button>
                    ))}
                </div>
            ) : (
                <div id="no-channels">
                    <p>No stream available.</p>
                </div>
            )}
        </div>
    );
};

export default SelectStream;
