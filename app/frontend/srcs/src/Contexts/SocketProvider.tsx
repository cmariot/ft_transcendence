import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { UserContext } from "./UserProvider";
import axios from "axios";
import { ChatContext } from "./ChatProvider";

let host: string =
    process.env.SOCKETHOST !== undefined ? process.env.SOCKETHOST : "";

export type SocketContextType = {};

export const socket = io(host);

export const SocketContext = createContext({
    socket: socket,
});

type SocketProviderProps = { children: JSX.Element | JSX.Element[] };
const SocketProvider = ({ children }: SocketProviderProps) => {
    const user = useContext(UserContext);
    const chat = useContext(ChatContext);

    // Emit login events
    useEffect(() => {
        if (user.username.length && user.isLogged) {
            console.log("[FRONTEND]", user.username, "is online");
            if (!socket.connected) {
                socket.on("connect", () => {
                    console.log("on connect");
                    socket.emit("userConnexion", {
                        socket: socket.id,
                        username: user.username,
                    });
                });
            } else {
                console.log("on connect");
                socket.emit("userConnexion", {
                    socket: socket.id,
                    username: user.username,
                });
            }
        }
    }, [user.isLogged, user.username]);

    const value = {
        socket: socket,
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
