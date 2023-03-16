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
        async function updateGameMenu(data: { menu: string }) {
            game.setMenu(data.menu);
        }
        socket.on("game.menu.change", updateGameMenu);
        return () => {
            socket.off("game.menu.change", updateGameMenu);
        };
    }, [game, socket]);

    return <>{children}</>;
};
