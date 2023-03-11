import { createContext, useContext, useEffect } from "react";
import { Socket, io } from "socket.io-client";
import { UserContext } from "./UserProvider";

export type SocketContextType = Socket;

const socket: Socket = io("localhost:8443");

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
        if (!user.isLogged && user.username.length) {
            socket.emit("user.logout", { username: user.username });
        }
        return () => {
            socket.off("user.logout");
        };
    }, [user.isLogged, user.username]);

    useEffect(() => {
        function updateStatus(data: { username: string; status: string }) {
            console.log("status.update :", data.username, "is", data.status);
            if (data.username === user.username) {
                user.setStatus(data.status);
            } else {
                let friends = user.friends;
                const index = friends.findIndex(
                    (friend) => friend.username === data.username
                );
                if (index !== -1 && friends[index].status !== data.status) {
                    friends[index].status = data.status;
                    user.setFriends(friends);
                }
            }
        }
        socket.on("status.update", updateStatus);
        return () => {
            socket.off("status.update", updateStatus);
        };
    }, [user]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
