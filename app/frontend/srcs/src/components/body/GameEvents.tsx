import { useContext, useEffect } from "react";
import { SocketContext } from "../../contexts/SocketProvider";
import { ChatContext } from "../../contexts/ChatProvider";
import axios from "axios";
import { UserContext } from "../../contexts/UserProvider";
import { GameContext } from "../../contexts/GameProvider";

type GameEventsProps = { children: JSX.Element | JSX.Element[] };
export const GameEvents = ({ children }: GameEventsProps) => {
    const chat = useContext(ChatContext);
    const socket = useContext(SocketContext);
    const user = useContext(UserContext);
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
        }
        socket.on("game.pos.update", updateGame);
        return () => {
            socket.off("game.pos.update", updateGame);
        };
    }, [game, socket]);

    return <>{children}</>;
};
