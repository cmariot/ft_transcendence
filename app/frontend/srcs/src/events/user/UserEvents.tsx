import { useContext, useEffect } from "react";
import { SocketContext } from "../../contexts/sockets/SocketProvider";
import { ChatContext } from "../../contexts/chat/ChatContext";
import { UserContext } from "../../contexts/user/UserContext";
import { MenuContext } from "../../contexts/menu/MenuContext";
import axios from "axios";

type UserEventsProps = { children: JSX.Element | JSX.Element[] };
export const UserEvents = ({ children }: UserEventsProps) => {
    const user = useContext(UserContext);
    const socket = useContext(SocketContext);
    const menu = useContext(MenuContext);

    // Emit an event at login
    useEffect(() => {
        if (user.isLogged && user.clickOnLogin) {
            user.setClickOnLogin(false);
            socket.emit("user.login", { username: user.username });
            return () => {
                socket.off("user.login");
            };
        }
    }, [user, socket]);

    // Emit an event at logout
    useEffect(() => {
        if (user.isLogged && user.clickOnLogout) {
            user.setClickOnLogout(false);
            user.setIsLogged(false);
            socket.emit("user.logout", { username: user.username });
            return () => {
                socket.off("user.logout");
            };
        }
    }, [user, socket]);

    // When the current user is forced to logout by the backend
    useEffect(() => {
        function logout() {
            user.setIsForcedLogout(true);
            user.setStatus("offline");
        }

        socket.on("user.disconnect", logout);
        return () => {
            socket.off("user.disconnect", logout);
        };
    }, [socket]);

    // Subscribe to status.update : update the user status or friends status
    useEffect(() => {
        function updateStatus(data: { username: string; status: string }) {
            if (data.username === user.username) {
                user.setStatus(data.status);
            } else {
                let friends = user.friends;
                const index = friends.findIndex(
                    (friend: any) => friend.username === data.username
                );
                if (index !== -1 && friends[index].status !== data.status) {
                    friends[index].status = data.status;
                    user.setFriends(friends);
                }
            }
        }
        socket.on(
            "status.update",
            (data: { username: string; status: string }) => updateStatus(data)
        );
        return () => {
            socket.off("status.update", updateStatus);
        };
    }, [socket, user]);

    const chat = useContext(ChatContext);

    // Subscribe to user.update.username : update the friends username
    useEffect(() => {
        function updateFriendUsername(data: {
            previousUsername: string;
            newUsername: string;
        }) {
            if (data.newUsername !== user.username) {
                // update friends
                let friends = user.friends;
                let index = friends.findIndex(
                    (friend: any) => friend.username === data.previousUsername
                );
                if (index !== -1) {
                    friends[index].username = data.newUsername;
                    user.setFriends(friends);
                }

                // update blocked
                let blocked = user.blocked;
                index = blocked.findIndex(
                    (blocked: any) => blocked.username === data.previousUsername
                );
                if (index !== -1) {
                    blocked[index].username = data.newUsername;
                    user.setBlocked(friends);
                }

                // update game history
                let history = user.gameHistory;
                for (let i = 0; i < history.length; i++) {
                    if (history[i].loser === data.previousUsername) {
                        history[i].loser = data.newUsername;
                    } else if (history[i].winner === data.previousUsername) {
                        history[i].winner = data.newUsername;
                    }
                }
                user.setGamehistory(history);

                // update chat
                if (chat.channel.length)
                    axios
                        .post("/api/chat/connect", {
                            channelName: chat.channel,
                        })
                        .then(function (response: any) {
                            chat.setMessages(response.data.messages);
                        })
                        .catch(function (error) {
                            menu.displayError(error.response.data.message);
                        });
            }
        }

        socket.on("user.update.username", (data) => updateFriendUsername(data));
        return () => {
            socket.off("user.update.username", updateFriendUsername);
        };
    }, [socket, user, chat]);

    // Subscribe to user.update.avatar : update the user avatar or friends avatar
    useEffect(() => {
        async function updateFriendAvatar(data: { username: string }) {
            if (data.username !== user.username) {
                let friends = user.friends;
                let index = friends.findIndex(
                    (friend: any) => friend.username === data.username
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
                    (block: any) => block.username === data.username
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
        socket.on("user.update.avatar", (data: any) =>
            updateFriendAvatar(data)
        );
        return () => {
            socket.off("user.update.avatar", updateFriendAvatar);
        };
    }, [socket, user]);

    // When leaderboard rank is update
    useEffect(() => {
        function updateLeaderboardRank(data: { rank: number }) {
            user.setRank(data.rank);
        }
        socket.on("rank.update", updateLeaderboardRank);
        return () => {
            socket.off("rank.update", updateLeaderboardRank);
        };
    }, [socket]);

    return <>{children}</>;
};
