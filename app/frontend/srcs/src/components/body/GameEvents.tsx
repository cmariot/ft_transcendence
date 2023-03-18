import { useContext, useEffect } from "react";
import { SocketContext } from "../../contexts/SocketProvider";
import { GameContext } from "../../contexts/GameProvider";

type GameEventsProps = { children: JSX.Element | JSX.Element[] };
export const GameEvents = ({ children }: GameEventsProps) => {
    const socket = useContext(SocketContext);
    const game = useContext(GameContext);

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
        async function updateGame(data: any) {
            game.setPaddle1(data.player1);
            game.setPaddle2(data.player2);
            game.setBall(data.ball);
            game.setScreenHeigth(data.screenHeigth);
            game.setScreenWidth(data.screenWidth);
            game.setPaddleHeigth(data.paddleHeigth);
            game.setPaddleWidth(data.paddleWidth);
            game.setPaddleOffset(data.paddleOffset);
            game.setBallRadius(data.ballRadius);
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
