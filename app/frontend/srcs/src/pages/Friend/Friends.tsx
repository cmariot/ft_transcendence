import { useContext, useEffect, useState } from "react";
import "../../styles/Friends.css";
import { UserContext } from "../../contexts/UserProvider";
import { ChatContext } from "../../contexts/ChatProvider";
import { useNavigate } from "react-router-dom";
import axios, { HttpStatusCode } from "axios";
import { SocketContext } from "../../contexts/SocketProvider";
import { GameContext } from "../../contexts/GameProvider";
import { MenuContext } from "../../contexts/MenuProviders";

export default function Friends() {
    const [username, setUsername] = useState("");
    let [showMenu, setShowMenu] = useState("");
    let [update, setUpdate] = useState(false);
    let socket = useContext(SocketContext);
    let chat = useContext(ChatContext);
    let user = useContext(UserContext);
    const game = useContext(GameContext);
    const menu = useContext(MenuContext);
    const navigate = useNavigate();

    useEffect(() => {
        setShowMenu("");
    }, [update]);

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

    async function profile(username: string) {
        navigate("/profile/" + username);
    }

    async function directMessage(username: string) {
        await axios
            .post("/api/chat/direct-message", { username: username })
            .then((response) => {
                if (response.status === HttpStatusCode.NoContent) {
                    chat.setDirectMessageUser(username);
                    chat.setPage("CreatePrivate");
                    return navigate("/");
                } else {
                    chat.setPage("ChatConv");
                    chat.setChannel(response.data.channelName);
                    chat.setMessages(response.data.data.messages);
                    chat.setisChannelOwner(response.data.data.channel_owner);
                    chat.setChannelType("direct_message");
                    chat.setAdmins(response.data.data.channel_admins);
                    chat.setmutedUsers(response.data.data.muted_users);
                    chat.setbannedUsers(response.data.data.banned_users);
                    return navigate("/");
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
        await user.addFriend(username);
        setUsername("");
    }

    async function watchStream(username: string) {
        let currentGames = game.currentGames;
        for (let i = 0; i < currentGames.length; i++) {
            if (
                currentGames[i].player1 === username ||
                currentGames[i].player2 === username
            ) {
                const watchResponse = await axios.post("/api/game/watch", {
                    game_id: currentGames[i].game_id,
                });
                if (watchResponse.status === 201) {
                    game.setMenu("Stream");
                    navigate("/");
                }
                return;
            }
        }
    }

    async function invitePlay(username: string) {
        await axios
            .post("/api/game/invitation/send", { username: username })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                menu.displayError(error.response.data.message);
            });
    }

    return (
        <div id="friends">
            <aside id="add-friend">
                <h2>Add a new friend</h2>
                <form onSubmit={(event) => addFriend(event)} autoComplete="off">
                    <input
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                    <button type="submit">Add Friend</button>
                </form>
            </aside>
            <main id="friend-list-main">
                {!user.friends.length && !user.blocked.length && (
                    <p>Let's add some friends !</p>
                )}
                {user.friends.length > 0 && (
                    <ul id="friend-list">
                        <h2>Friends list</h2>
                        {user.friends.map((friend: any, index: number) => (
                            <li className="friend" key={index}>
                                <div className="div-friend-list">
                                    <img
                                        src={friend.avatar}
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
                                                await user.block(
                                                    friend["username"]
                                                );
                                                if (chat.channel.length) {
                                                    await axios
                                                        .post(
                                                            "/api/chat/connect",
                                                            {
                                                                channelName:
                                                                    chat.channel,
                                                            }
                                                        )
                                                        .then(function (
                                                            response: any
                                                        ) {
                                                            chat.setMessages(
                                                                response.data
                                                                    .messages
                                                            );
                                                        })
                                                        .catch(function (
                                                            error
                                                        ) {
                                                            menu.displayError(
                                                                error.response
                                                                    .data
                                                                    .message
                                                            );
                                                        });
                                                }
                                                setUpdate(
                                                    (prevState) => !prevState
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
                )}
                {user.blocked.length > 0 && (
                    <ul id="friend-list">
                        <h2>blocked list</h2>
                        {user.blocked.map((blocked, index) => (
                            <li className="friend blocked" key={index}>
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
            </main>
        </div>
    );
}
