import { createContext, useContext, useEffect } from "react";
import { Socket, io } from "socket.io-client";
import { UserContext } from "./UserProvider";

export type SocketContextType = Socket;

export const socket = io("mbp.local:8443");

export const SocketContext = createContext(socket);

type SocketProviderProps = { children: JSX.Element | JSX.Element[] };
const SocketProvider = ({ children }: SocketProviderProps) => {
    const user = useContext(UserContext);

    useEffect(() => {
        if (user.isLogged && user.username.length) {
            socket.emit("user.login", { username: user.username });
        }
        return () => {
            socket.off("user.login");
        };
    }, [user.isLogged, user.username]);

    useEffect(() => {
        function updateStatus(data: { username: string; status: string }) {
            console.log("Event received :", data);
        }
        socket.on("status.update", updateStatus);
        return () => {
            socket.off("status.update", updateStatus);
        };
    }, [user.username]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
