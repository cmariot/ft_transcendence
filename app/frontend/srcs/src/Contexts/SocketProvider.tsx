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

    const [status, setStatus] = useState("");

    // Emit login / logout events
    useEffect(() => {
        if (user.username.length && user.isLogged) {
            console.log(user.username, "is online");
            socket.emit("userStatus", {
                status: "Online",
                socket: socket.id,
                username: user.username,
            });
            setStatus("Online");
        } else if (user.username.length && !user.isLogged) {
            console.log(user.username, "is offline");
            socket.emit("userStatus", {
                status: "Offline",
                socket: socket.id,
                username: user.username,
            });
            setStatus("Offline");
        }
    }, [user.isLogged, user.username]);

    useEffect(() => {
        user.setStatus(status);
    }, [user, status]);

    useEffect(() => {
        socket.on("userUpdate", (socket) => {
            console.log(socket);
            axios
                .get("/api/profile/friends")
                .then((response) => user.setFriends(response.data))
                .catch((error) => console.log(error.data));
        });
        socket.on("newChatMessage", (socket) => {
            console.log(socket);
            axios
                .post("/api/chat/messages", { channelName: socket.channel })
                .then((response) => chat.setMessages(response.data.messages))
                .catch((error) => console.log(error.data));
        });
        return () => {
            socket.off("userUpdate");
            socket.off("newChatMessage");
        };
    });

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
