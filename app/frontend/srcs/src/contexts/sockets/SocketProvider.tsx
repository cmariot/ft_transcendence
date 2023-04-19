import { createContext } from "react";
import { Socket, io } from "socket.io-client";

export type SocketContextType = Socket;

// @ts-ignore
const socket: Socket = io(import.meta.env.VITE_SOCKETHOST);
export const SocketContext = createContext(socket);

type SocketProviderProps = { children: JSX.Element | JSX.Element[] };
const SocketProvider = ({ children }: SocketProviderProps) => {
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
