import { createContext, useContext, useEffect } from "react";
import { Socket, io } from "socket.io-client";
import { UserContext } from "./UserProvider";
import axios from "axios";

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

    useEffect(() => {
        function updateFriendUsername(data: {
            previousUsername: string;
            newUsername: string;
        }) {
            console.log(
                "user.update.username :",
                data.previousUsername,
                "changed his username to",
                data.newUsername
            );
            // reconnexion au chat pour mettre a jour les messages
            if (data.newUsername !== user.username) {
                let friends = user.friends;
                let index = friends.findIndex(
                    (friend) => friend.username === data.previousUsername
                );
                if (index !== -1) {
                    friends[index].username = data.newUsername;
                    user.setFriends(friends);
                }
                let blocked = user.blocked;
                index = blocked.findIndex(
                    (blocked) => blocked.username === data.previousUsername
                );
                if (index !== -1) {
                    blocked[index].username = data.newUsername;
                    user.setBlocked(friends);
                }
            }
        }
        socket.on("user.update.username", updateFriendUsername);
        return () => {
            socket.off("user.update.username", updateFriendUsername);
        };
    }, [user]);

    useEffect(() => {
        async function updateFriendAvatar(data: { username: string }) {
            console.log(
                "user.update.avatar :",
                data.username,
                "changed his avatar"
            );
            if (data.username !== user.username) {
                let friends = user.friends;
                let index = friends.findIndex(
                    (friend) => friend.username === data.username
                );
                if (index !== -1) {
                    try {
                        const url = "/api/profile/" + data.username + "/image";
                        const avatarResponse = await axios.get(url, {
                            responseType: "blob",
                        });
                        if (avatarResponse.status === 200) {
                            let imageUrl = URL.createObjectURL(
                                avatarResponse.data
                            );
                            user.friends[index].avatar = imageUrl;
                            user.setFriends(friends);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
                let blocked = user.blocked;
                index = blocked.findIndex(
                    (blocked) => blocked.username === data.username
                );
                if (index !== -1) {
                    try {
                        const url = "/api/profile/" + data.username + "/image";
                        const avatarResponse = await axios.get(url, {
                            responseType: "blob",
                        });
                        if (avatarResponse.status === 200) {
                            let imageUrl = URL.createObjectURL(
                                avatarResponse.data
                            );
                            user.blocked[index].avatar = imageUrl;
                            user.setBlocked(blocked);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            }
        }

        socket.on("user.update.avatar", updateFriendAvatar);

        return () => {
            socket.off("user.update.avatar", updateFriendAvatar);
        };
    }, [user]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
