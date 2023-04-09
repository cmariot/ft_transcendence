import { createContext } from "react";
import { Socket, io } from "socket.io-client";

export type SocketContextType = Socket;

const host = "https://mbp.local:8443";
const socket: Socket = io(host);
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