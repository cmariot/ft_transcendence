import { useContext, useEffect } from "react";
import { SocketContext } from "../../contexts/sockets/SocketProvider";
import { GameContext } from "../../contexts/game/GameContext";
import { UserContext } from "../../contexts/user/UserContext";
import { updateGameMenu } from "./functions/updateGameMenu";
import { addToGamesList } from "./functions/addToGamesList";
import { removeFromGamesList } from "./functions/removeFromGamesList";
import { displayStreamResults } from "./functions/displayStreamResults";

type GameEventsProps = { children: JSX.Element | JSX.Element[] };
export const GameEvents = ({ children }: GameEventsProps) => {
    const socket = useContext(SocketContext);
    const game = useContext(GameContext);
    const user = useContext(UserContext);

    useEffect(() => {
        socket.on("game.menu.change", (data: any) =>
            updateGameMenu(data, game)
        );
        return () => {
            socket.off("game.menu.change", updateGameMenu);
        };
    }, [game, socket]);

    useEffect(() => {
        socket.on("game.name", (id: string) => game.setGameID(id));
        return () => {
            socket.off("game.name", (id: string) => game.setGameID(id));
        };
    }, [game, socket]);

    useEffect(() => {
        socket.on("game.start", (data: any) => addToGamesList(data, game));
        return () => {
            socket.off("game.start", addToGamesList);
        };
    }, [game, socket]);

    useEffect(() => {
        socket.on("game.end", (data: any) => removeFromGamesList(data, game));
        return () => {
            socket.off("game.end", removeFromGamesList);
        };
    }, [game, socket]);

    useEffect(() => {
        function updateHistory(data: {
            winner: string;
            loser: string;
            winner_score: number;
            loser_score: number;
            rank: number;
        }) {
            let history: {
                winner: string;
                loser: string;
                winner_score: number;
                loser_score: number;
            }[] = user.gameHistory;
            history.push({
                winner: data.winner,
                loser: data.loser,
                winner_score: data.winner_score,
                loser_score: data.loser_score,
            });
            user.setGamehistory(history);
            let ratio = user.winRatio;
            if (data.winner === user.username) {
                ratio.victory++;
            } else {
                ratio.defeat++;
            }
            user.setWinRatio(ratio);
            user.setRank(data.rank);
        }
        socket.on("game.results", updateHistory);

        return () => {
            socket.off("game.results", updateHistory);
        };
    }, []);

    useEffect(() => {
        socket.on("stream.results", (data: any) =>
            displayStreamResults(data, game)
        );
        return () => {
            socket.off("stream.results", displayStreamResults);
        };
    }, [game, socket]);

    useEffect(() => {
        async function updateGame(data: any) {
            game.setPaddle1(data.player1Position);
            game.setPaddle2(data.player2Position);
            game.setBall(data.ballPosition);
            game.setScreenHeigth(data.screenHeigth);
            game.setScreenWidth(data.screenWidth);
            game.setPaddle1Heigth(data.paddle1Heigth);
            game.setPaddle2Heigth(data.paddle2Heigth);
            game.setPaddleWidth(data.paddleWidth);
            game.setPaddleOffset(data.paddleOffset);
            game.setBallHeigth(data.ballHeigth);
            game.setBallWidth(data.ballWidth);
            game.setP1Name(data.player1Username);
            game.setP2Name(data.player2Username);
            game.setP1Score(data.player1Score);
            game.setP2Score(data.player2Score);
            game.setPowerUps(data.power_up_list);
            game.setP1Power(data.power_up_player1);
            game.setP2Power(data.power_up_player2);
        }
        socket.on("game.pos.update", updateGame);
        return () => {
            socket.off("game.pos.update", updateGame);
        };
    }, [game, socket]);

    return <>{children}</>;
};
