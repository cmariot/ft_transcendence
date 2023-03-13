import { createContext, useContext, useEffect } from "react";
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
