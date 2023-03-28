import { useContext, useEffect } from "react";
import { SocketContext } from "../contexts/SocketProvider";
import { GameContext } from "../contexts/GameProvider";
import { UserContext } from "../contexts/UserProvider";

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
            if (data.countDown) {
                game.setCountDown(data.countDown);
            }
        }
        socket.on("game.menu.change", updateGameMenu);
        return () => {
            socket.off("game.menu.change", updateGameMenu);
        };
    }, [game, socket]);

    useEffect(() => {
        async function setGameID(id: string) {
            game.setGameID(id);
        }
        socket.on("game.name", setGameID);
        return () => {
            socket.off("game.name", setGameID);
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
            if (index === -1) {
                games.push(data);
                game.setCurrentGames(games);
            }
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
        }
        socket.on("game.end", updateGamesList);
        return () => {
            socket.off("game.end", updateGamesList);
        };
    }, [game, socket]);

    useEffect(() => {
        async function updateHistory(data: {
            winner: string;
            loser: string;
            winner_score: number;
            loser_score: number;
            rank: number;
        }) {
            let history = user.gameHistory;
            history.push(data);
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
    }, [game, socket, user]);

    useEffect(() => {
        async function setGameID(id: string) {
            game.setGameID(id);
        }
        socket.on("game.name", setGameID);
        return () => {
            socket.off("game.name", setGameID);
        };
    }, [game, socket]);

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
            game.setMenu("StreamResults");
        }
        socket.on("stream.results", displayStreamResults);
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
            game.setPaddleHeigth(data.paddleHeigth);
            game.setPaddleWidth(data.paddleWidth);
            game.setPaddleOffset(data.paddleOffset);
            game.setBallHeigth(data.ballHeigth);
            game.setBallWidth(data.ballWidth);
            game.setP1Name(data.player1Username);
            game.setP2Name(data.player2Username);
            game.setP1Score(data.player1Score);
            game.setP2Score(data.player2Score);
        }
        socket.on("game.pos.update", updateGame);
        return () => {
            socket.off("game.pos.update", updateGame);
        };
    }, [game, socket]);

    return <>{children}</>;
};
