import { createContext, useCallback, useContext, useEffect } from "react";
import { Socket, io } from "socket.io-client";
import { UserContext } from "./UserProvider";
import axios from "axios";
import { ChatContext } from "./ChatProvider";

export type SocketContextType = Socket;

const socket: Socket = io("localhost:8443");

export const SocketContext = createContext(socket);

type SocketProviderProps = { children: JSX.Element | JSX.Element[] };
const SocketProvider = ({ children }: SocketProviderProps) => {
    const user = useContext(UserContext);
    const chat = useContext(ChatContext);

    useEffect(() => {
        function logout() {
            console.log(
                "user.disconnect: disconnect this client (another connexion started)"
            );
            user.setIsForcedLogout(true);
        }
        socket.on("user.disconnect", logout);
        return () => {
            socket.off("user.disconnect", logout);
        };
    }, [user]);

    // Emit an event at login
    useEffect(() => {
        if (user.isLogged && user.username.length) {
            socket.emit("user.login", { username: user.username });
        }
        return () => {
            socket.off("user.login");
        };
    }, [user.isLogged, user.username]);

    // Emit an event at logout
    useEffect(() => {
        if (!user.isLogged && user.username.length) {
            socket.emit("user.logout", { username: user.username });
        }
        return () => {
            socket.off("user.logout");
        };
    }, [user.isLogged, user.username]);

    const updateStatus = useCallback(
        (data: { username: string; status: string }) => {
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
        },
        [user]
    );

    // Subscribe to status.update : update the user status or friends status
    useEffect(() => {
        socket.on("status.update", updateStatus);
        return () => {
            socket.off("status.update", updateStatus);
        };
    }, [user, updateStatus]);

    // Subscribe to user.update.username : update username of othe users when changed
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

    useEffect(() => {
        function updateChannels() {
            console.log("chat.channels.update :");
            function arrayToMap(array: Array<any>) {
                let map = new Map<
                    string,
                    { channelName: string; channelType: string }
                >();
                for (let i = 0; i < array.length; i++) {
                    if (array[i].channelName) {
                        map.set(array[i].channelName, array[i]);
                    }
                }
                return map;
            }
            if (user.isLogged) {
                (async () => {
                    try {
                        const [channelsResponse] = await Promise.all([
                            axios.get("/api/chat/channels"),
                        ]);

                        if (channelsResponse.status === 200) {
                            chat.updateUserChannels(
                                arrayToMap(channelsResponse.data.userChannels)
                            );
                            chat.updateUserPrivateChannels(
                                arrayToMap(
                                    channelsResponse.data.userPrivateChannels
                                )
                            );
                            chat.updateAvailableChannels(
                                arrayToMap(
                                    channelsResponse.data.availableChannels
                                )
                            );
                        }
                    } catch (error) {
                        console.log(error);
                    }
                })();
            }
        }
        socket.on("chat.channels.update", updateChannels);
        return () => {
            socket.off("chat.channels.update", updateChannels);
        };
    }, [chat, user.isLogged]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
