import { useContext, useEffect, useState } from "react";
import "../../styles/Friends.css";
import { useNavigate } from "react-router-dom";
import axios, { HttpStatusCode } from "axios";
import { SocketContext } from "../../contexts/sockets/SocketProvider";
import { GameContext } from "../../contexts/game/GameContext";
import { ChatContext } from "../../contexts/chat/ChatContext";
import { UserContext } from "../../contexts/user/UserContext";
import { MenuContext } from "../../contexts/menu/MenuContext";
import { arrayToMap } from "../../events/chat/functions/arrayToMap";

export default function Friends() {
    const [username, setUsername] = useState("");
    const [showMenu, setShowMenu] = useState("");
    const [update, setUpdate] = useState(false);

    const socket = useContext(SocketContext);
    const chat = useContext(ChatContext);
    const user = useContext(UserContext);
    const game = useContext(GameContext);
    const menu = useContext(MenuContext);

    const navigate = useNavigate();

    useEffect(() => {
        setShowMenu("");
    }, [update]);

    // On friend status update
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
            setUpdate((prevState) => !prevState);
        }
        socket.on("status.update", updateStatus);
        return () => {
            socket.off("status.update", updateStatus);
        };
    }, [user, socket]);

    // On friend/blocked avatar update
    useEffect(() => {
        async function updateFriendAvatar(data: { username: string }) {
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
                            setUpdate((prevState) => !prevState);
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
                            setUpdate((prevState) => !prevState);
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
    }, [user, socket]);

    // On friend/blocked username update
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
            }
            setUpdate((prevState) => !prevState);
        }
        socket.on("user.update.username", updateFriendUsername);
        return () => {
            socket.off("user.update.username", updateFriendUsername);
        };
    }, [user, socket]);

    // Navigate to friend's profile
    async function profile(username: string) {
        navigate("/profile/" + username);
    }

    // Send a direct message to a friend
    async function directMessage(username: string) {
        await axios
            .post("/api/chat/direct-message", { username: username })
            .then(async (response) => {
                if (response.status === HttpStatusCode.NoContent) {
                    chat.setDirectMessageUser(username);
                    chat.setPage("CreatePrivate");
                    return navigate("/");
                } else {
                    try {
                        const connectResponse = await axios.post(
                            "/api/chat/connect",
                            {
                                channelName: response.data.channelName,
                            }
                        );
                        if (connectResponse.status === 201) {
                            chat.setChannel(response.data.channelName);
                            chat.setMessages(connectResponse.data.messages);
                            chat.setChannelType("direct_message");
                            chat.setbannedUsers(
                                connectResponse.data.banned_users
                            );
                            chat.setmutedUsers(
                                connectResponse.data.muted_users
                            );
                            chat.setisChannelOwner(
                                connectResponse.data.channel_owner
                            );
                            chat.setisChannelAdmin(
                                connectResponse.data.channel_admin
                            );
                            chat.setAdmins(connectResponse.data.channel_admins);
                            chat.setPage("ChatConv");
                            return navigate("/");
                        }
                    } catch (connectResponse: any) {
                        console.log(connectResponse);
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    async function toogleMenu(username: string) {
        if (showMenu === username) {
            closeMenu();
        } else {
            setShowMenu(username);
        }
    }

    async function closeMenu() {
        setShowMenu("");
    }

    function displayStatus(status: string) {
        if (status === "online") {
            return <div title="online" className="friend-status-online" />;
        } else if (status === "offline") {
            return <div title="offline" className="friend-status-offline" />;
        } else if (status === "ingame") {
            return <div title="in a game" className="friend-status-in-game" />;
        } else if (status === "matchmaking") {
            return (
                <div
                    title="searching for a game"
                    className="friend-status-matchmaking"
                />
            );
        } else {
            return <p>{status}</p>;
        }
    }

    async function addFriend(event: any) {
        event.preventDefault();
        let friendList = user.friends;
        try {
            const friendsResponse = await axios.post(
                "/api/profile/friends/add",
                {
                    username: username,
                }
            );
            if (friendsResponse.status === 201) {
                let avatar: string;
                try {
                    const url = "/api/profile/" + username + "/image";
                    const avatarResponse = await axios.get(url, {
                        responseType: "blob",
                    });
                    if (avatarResponse.status === 200) {
                        let imageUrl = URL.createObjectURL(avatarResponse.data);
                        avatar = imageUrl;
                    } else {
                        avatar = url;
                    }
                    friendList.push({
                        username: username,
                        status: friendsResponse.data.status,
                        avatar: avatar,
                    });
                    user.setFriends(friendList);
                } catch (error: any) {
                    menu.displayError(error.response.data.message);
                }
            }
        } catch (error: any) {
            menu.displayError(error.response.data.message);
        }
        setUsername("");
    }

    async function watchStream(username: string) {
        let currentGames = game.currentGames;
        for (let i = 0; i < currentGames.length; i++) {
            if (
                currentGames[i].player1 === username ||
                currentGames[i].player2 === username
            ) {
                try {
                    const watchResponse = await axios.post("/api/game/watch", {
                        prev_game_id: game.currentStreamGameID,
                        new_game_id: currentGames[i].game_id,
                    });
                    if (watchResponse.status === 201) {
                        game.setCurrentStreamGameID(currentGames[i].game_id);
                        game.setMenu("Stream");
                        navigate("/#game");
                    }
                } catch (error: any) {
                    menu.displayError(error.response.data.message);
                }
                return;
            }
        }
    }

    async function invitePlay(username: string) {
        await axios
            .post("/api/game/invitation/send", { username: username })
            .catch((error) => {
                menu.displayError(error.response.data.message);
            });
    }

    async function blockUser(username: string) {
        await user.block(username);
        if (chat.channel.length) {
            if (chat.channelType === "direct_message") {
                let channels = new Map<string, { channelType: string }>(
                    chat.userPrivateChannels
                );
                if (channels.delete(chat.channel)) {
                    chat.updateUserPrivateChannels(channels);
                }
                chat.setMessages([]);
                chat.setChannel("");
                chat.setChannelType("");
                chat.setmutedUsers([]);
                chat.setbannedUsers([]);
                chat.closeMenu();
                chat.setPage("YourChannels");
            } else {
                await axios
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
        setUpdate((prevState) => !prevState);
    }

    return (
        <div id="friend-parent">
            <div id="friends" className="main-app-div">
                {/* FriendsList */}
                {
                    <ul id="friend-list">
                        {user.friends.length === 0 ? (
                            <h2>You have no friend yet.</h2>
                        ) : (
                            <h2>Your friends</h2>
                        )}
                        <form
                            onSubmit={(event) => addFriend(event)}
                            autoComplete="off"
                        >
                            <input
                                type="text"
                                value={username}
                                placeholder="New friend username"
                                onChange={(event) =>
                                    setUsername(event.target.value)
                                }
                            />
                            <button type="submit">Add Friend</button>
                        </form>
                        {user.friends.map((friend: any, index: number) => (
                            <li className="friend" key={index}>
                                {/* Friend */}
                                <div className="div-friend-list">
                                    <img
                                        src={`${friend.avatar}`}
                                        className="friend-profile-picture"
                                        alt="Friend's avatar"
                                    />
                                    <div className="friend-middle-div">
                                        {displayStatus(friend["status"])}
                                        <p className="friend-username">
                                            <b>{friend["username"]}</b>
                                        </p>
                                    </div>

                                    <button
                                        className="friend-profile-button"
                                        onClick={() =>
                                            toogleMenu(friend.username)
                                        }
                                    >
                                        Menu
                                    </button>
                                </div>
                                {/* FriendMenu */}
                                {showMenu === friend.username && (
                                    <menu className="friend-menu">
                                        {friend.status === "ingame" ? (
                                            <button
                                                className="friend-menu-button"
                                                onClick={() => {
                                                    watchStream(
                                                        friend.username
                                                    );
                                                }}
                                            >
                                                Watch stream
                                            </button>
                                        ) : (
                                            <button
                                                className="friend-menu-button"
                                                onClick={() =>
                                                    invitePlay(friend.username)
                                                }
                                            >
                                                Invite to play
                                            </button>
                                        )}

                                        <button
                                            className="friend-menu-button"
                                            onClick={() =>
                                                directMessage(
                                                    friend["username"]
                                                )
                                            }
                                        >
                                            Direct message
                                        </button>
                                        <button
                                            className="friend-menu-button"
                                            onClick={() =>
                                                profile(friend["username"])
                                            }
                                        >
                                            Profile
                                        </button>
                                        <button
                                            className="friend-menu-button"
                                            onClick={async () => {
                                                await user.removeFriend(
                                                    friend["username"]
                                                );
                                                setUpdate(
                                                    (prevState) => !prevState
                                                );
                                            }}
                                        >
                                            Remove Friend
                                        </button>
                                        <button
                                            className="friend-menu-button"
                                            onClick={async () => {
                                                await blockUser(
                                                    friend.username
                                                );
                                            }}
                                        >
                                            Block
                                        </button>
                                    </menu>
                                )}
                            </li>
                        ))}
                    </ul>
                }
                {/* BlockedList */}
                {user.blocked.length > 0 && (
                    <ul id="friend-list">
                        <h2>blocked list</h2>
                        {user.blocked.map((blocked, index) => (
                            <li className="friend blocked" key={index}>
                                {/* Blocked */}
                                <img
                                    src={blocked["avatar"]}
                                    className="friend-profile-picture"
                                    alt="Friend's avatar"
                                />
                                <div className="friend-middle-div">
                                    <p className="friend-username">
                                        <b>{blocked["username"]}</b>
                                    </p>
                                </div>
                                <button
                                    onClick={async () => {
                                        await user.unblock(blocked["username"]);
                                        const [channelsResponse] =
                                            await Promise.all([
                                                axios.get("/api/chat/channels"),
                                            ]);

                                        if (channelsResponse.status === 200) {
                                            chat.updateUserChannels(
                                                arrayToMap(
                                                    channelsResponse.data
                                                        .userChannels
                                                )
                                            );
                                            chat.updateUserPrivateChannels(
                                                arrayToMap(
                                                    channelsResponse.data
                                                        .userPrivateChannels
                                                )
                                            );
                                            chat.updateAvailableChannels(
                                                arrayToMap(
                                                    channelsResponse.data
                                                        .availableChannels
                                                )
                                            );
                                        }

                                        if (chat.channel.length) {
                                            await axios
                                                .post("/api/chat/connect", {
                                                    channelName: chat.channel,
                                                })
                                                .then(function (response: any) {
                                                    chat.setMessages(
                                                        response.data.messages
                                                    );
                                                })
                                                .catch(function (error) {
                                                    menu.displayError(
                                                        error.response.data
                                                            .message
                                                    );
                                                });
                                        }
                                        setUpdate((prevState) => !prevState);
                                    }}
                                >
                                    unblock
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
