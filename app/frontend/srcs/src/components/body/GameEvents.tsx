import { useContext, useEffect } from "react";
import { SocketContext } from "../../contexts/SocketProvider";
import { GameContext } from "../../contexts/GameProvider";
import { UserContext } from "../../contexts/UserProvider";

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
            console.log("RANK = ", data.rank);
            user.setRank(data.rank);
        }
        socket.on("game.results", updateHistory);
        return () => {
            socket.off("game.results", updateHistory);
        };
    }, [game, socket, user]);

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
