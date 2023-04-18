import { useContext, useEffect } from "react";
import { SocketContext } from "../../contexts/sockets/SocketProvider";
import { GameContext } from "../../contexts/game/GameContext";
import { UserContext } from "../../contexts/user/UserContext";

type GameEventsProps = { children: JSX.Element | JSX.Element[] };
export const GameEvents = ({ children }: GameEventsProps) => {
    const socket = useContext(SocketContext);
    const game = useContext(GameContext);
    const user = useContext(UserContext);

    useEffect(() => {
        async function updateGameMenu(data: {
            menu: string;
            countDown: number;
        }) {
            game.setMenu(data.menu);
            if (data.countDown !== undefined) {
                game.setCountDown(data.countDown);
            }
        }

        socket.on(
            "game.menu.change",
            (data: { menu: string; countDown: number }) => updateGameMenu(data)
        );
        return () => {
            socket.off("game.menu.change", updateGameMenu);
        };
    }, [socket]);

    useEffect(() => {
        socket.on("game.name", (id: string) => game.setGameID(id));
        return () => {
            socket.off("game.name", (id: string) => game.setGameID(id));
        };
    }, [socket]);

    useEffect(() => {
        async function addToGamesList(data: {
            game_id: string;
            player1: string;
            player2: string;
        }) {
            let games = game.currentGames;
            let index = games.findIndex(
                (element: any) => element.game_id === data.game_id
            );
            if (index === -1) {
                games.push(data);
                game.setCurrentGames(games);
            }
        }
        socket.on(
            "game.stream.start",
            (data: { game_id: string; player1: string; player2: string }) =>
                addToGamesList(data)
        );
        return () => {
            socket.off("game.stream.start", addToGamesList);
        };
    }, [socket]);

    useEffect(() => {
        async function removeFromGamesList(data: { game_id: string }) {
            let games = game.currentGames;
            let index = games.findIndex(
                (element: any) => element.game_id === data.game_id
            );
            if (index !== -1) {
                games.splice(index, 1);
                game.setCurrentGames(games);
            }
        }

        socket.on("game.end", (data: { game_id: string }) =>
            removeFromGamesList(data)
        );
        return () => {
            socket.off("game.end", removeFromGamesList);
        };
    }, [socket]);

    useEffect(() => {
        function updateHistory(data: {
            winner: string;
            loser: string;
            winner_score: number;
            loser_score: number;
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
            var ratio = user.winRatio;
            if (data.winner === user.username) {
                ratio.victory++;
            } else {
                ratio.defeat++;
            }
            user.setWinRatio(ratio);
        }
        socket.on("game.results", updateHistory);

        return () => {
            socket.off("game.results", updateHistory);
        };
    }, [socket, user]);

    useEffect(() => {
        async function displayStreamResults(data: {
            gameId: string;
            results: {
                winner: string;
                player1: string;
                player2: string;
                p1Score: number;
                p2Score: number;
            };
        }) {
            game.setStreamResults(data.results);
            game.setCurrentStreamGameID("");
            game.setGameID("");
            game.setMenu("StreamResults");
        }
        socket.on(
            "stream.results",
            (data: {
                gameId: string;
                results: {
                    winner: string;
                    player1: string;
                    player2: string;
                    p1Score: number;
                    p2Score: number;
                };
            }) => displayStreamResults(data)
        );
        return () => {
            socket.off("stream.results", displayStreamResults);
        };
    }, [socket]);

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
    }, [socket, game]);

    return <>{children}</>;
};
