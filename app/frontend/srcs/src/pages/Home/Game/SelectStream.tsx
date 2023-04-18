import { useContext, useEffect, useState } from "react";
import "../../../styles/JoinGame.css";
import { SocketContext } from "../../../contexts/sockets/SocketProvider";
import axios from "axios";
import { GameContext } from "../../../contexts/game/GameContext";

const SelectStream = () => {
    const game = useContext(GameContext);
    const socket = useContext(SocketContext);

    const [, setUpdate] = useState(false);

    async function cancel() {
        game.setMenu("JoinGame");
    }

    async function watchStream(match: {
        game_id: string;
        player1: string;
        player2: string;
    }) {
        const watchResponse = await axios.post("/api/game/watch", {
            prev_game_id: game.currentStreamGameID,
            new_game_id: match.game_id,
        });
        if (watchResponse.status === 201) {
            game.setCurrentStreamGameID(match.game_id);
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
        socket.on("game.stream.start", updateGamesList);
        return () => {
            socket.off("game.stream.start", updateGamesList);
        };
    }, [game, socket]);

    useEffect(() => {
        async function updateGamesList(data: { game_id: string }) {
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
            <button onClick={() => cancel()}>cancel</button>
        </div>
    );
};

export default SelectStream;
