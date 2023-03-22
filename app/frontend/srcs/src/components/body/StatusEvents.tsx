import { useContext, useEffect } from "react";
import { UserContext } from "../../contexts/UserProvider";
import { SocketContext } from "../../contexts/SocketProvider";
import axios from "axios";
import { ChatContext } from "../../contexts/ChatProvider";

type StatusEventsProps = { children: JSX.Element | JSX.Element[] };
export const StatusEvents = ({ children }: StatusEventsProps) => {
    const user = useContext(UserContext);
    const socket = useContext(SocketContext);

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
    }, [user, socket]);

    // Subscribe to status.update : update the user status or friends status
    useEffect(() => {
        function updateStatus(data: { username: string; status: string }) {
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
    }, [user, socket]);

    const chat = useContext(ChatContext);

    useEffect(() => {
        function updateFriendUsername(data: {
            previousUsername: string;
            newUsername: string;
        }) {
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
                let history = user.gameHistory;
                for (let i = 0; i < history.length; i++) {
                    if (history[i].loser === data.previousUsername) {
                        history[i].loser = data.newUsername;
                    } else if (history[i].winner === data.previousUsername) {
                        history[i].winner = data.newUsername;
                    }
                }
                user.setGamehistory(history);
                if (chat.channel.length)
                    axios
                        .post("/api/chat/connect", {
                            channelName: chat.channel,
                        })
                        .then(function (response: any) {
                            chat.setMessages(response.data.messages);
                        })
                        .catch(function (error) {
                            alert(error.response.data.message);
                        });
            }
        }

        socket.on("user.update.username", updateFriendUsername);

        return () => {
            socket.off("user.update.username", updateFriendUsername);
        };
    }, [user, socket, chat]);

    return <>{children}</>;
};
