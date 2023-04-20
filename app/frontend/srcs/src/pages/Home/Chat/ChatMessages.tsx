import { useContext, useState } from "react";
import axios, { HttpStatusCode } from "axios";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "../../../contexts/chat/ChatContext";
import { GameContext } from "../../../contexts/game/GameContext";
import { UserContext } from "../../../contexts/user/UserContext";

const ChatMessages = () => {
    const chat = useContext(ChatContext);
    const user = useContext(UserContext);
    const game = useContext(GameContext);
    const navigate = useNavigate();

    async function directMessage(username: string) {
        await axios
            .post("/api/chat/direct-message", { username: username })
            .then((response) => {
                if (response.status === HttpStatusCode.NoContent) {
                    chat.setDirectMessageUser(username);
                    chat.setPage("CreatePrivate");
                    return;
                } else {
                    axios
                        .post("/api/chat/connect", {
                            channelName: response.data.channelName,
                        })
                        .then(function (response2) {
                            chat.setChannel(response.data.channelName);
                            chat.setChannelType("direct_message");
                            chat.setMessages(response2.data.messages);
                            chat.setisChannelOwner(
                                response2.data.channel_owner
                            );
                            chat.setisChannelAdmin(
                                response2.data.channel_admin
                            );
                            chat.setAdmins(response2.data.channel_admins);
                            chat.setmutedUsers(response2.data.muted_users);
                            chat.setbannedUsers(response2.data.banned_users);
                            chat.setUsers(response2.data.private_channel_users);
                            chat.setPage("ChatConv");
                        })
                        .catch(function (error) {
                            console.log("joinChannel error: ", error);
                        });
                }
            })
            .catch((error) => {
                console.log("Catch : ", error);
            });
    }

    async function blockUser(username: string) {
        user.block(username);
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
                .then((response) => {
                    chat.setMessages(response.data.messages);
                })
                .catch((error) => {
                    console.log(error.data);
                });
        }
    }

    async function profile(username: string) {
        navigate("/profile/" + username);
    }

    async function invitePlay(username: string) {
        await axios
            .post("/api/game/invitation/send", { username: username })
            .catch((error) => {
                console.log(error);
            });
    }

    async function watchStream(username: string) {
        let currentGames = game.currentGames;
        for (let i = 0; i < currentGames.length; i++) {
            if (
                currentGames[i].player1 === username ||
                currentGames[i].player2 === username
            ) {
                const watchResponse = await axios.post("/api/game/watch", {
                    prev_game_id: game.currentStreamGameID,
                    new_game_id: currentGames[i].game_id,
                });
                if (watchResponse.status === 201) {
                    game.setCurrentStreamGameID(currentGames[i].game_id);
                    game.setMenu("Stream");
                    navigate("/#game");
                }
                return;
            }
        }
    }

    function messageMenu(username: string) {
        if (username !== user.username) {
            if (chat.channelType === "direct_message") {
                return (
                    <div className="chat-user-message-options">
                        {game.currentGames.findIndex(
                            (element) => element.player1 === username
                        ) !== -1 ||
                        game.currentGames.findIndex(
                            (element) => element.player2 === username
                        ) !== -1 ? (
                            <button
                                onClick={() => {
                                    watchStream(username);
                                }}
                            >
                                watch stream
                            </button>
                        ) : (
                            <button>play</button>
                        )}
                        <button onClick={() => profile(username)}>
                            profile
                        </button>
                        <button onClick={() => blockUser(username)}>
                            block
                        </button>
                    </div>
                );
            } else {
                return (
                    <div className="chat-user-message-options">
                        <button onClick={() => directMessage(username)}>
                            message
                        </button>
                        {game.currentGames.findIndex(
                            (element) =>
                                element.player1 === username &&
                                element.player2 !== user.username
                        ) !== -1 ||
                        game.currentGames.findIndex(
                            (element) =>
                                element.player1 !== user.username &&
                                element.player2 === username
                        ) !== -1 ? (
                            <button
                                onClick={() => {
                                    watchStream(username);
                                }}
                            >
                                watch stream
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    invitePlay(username);
                                }}
                            >
                                play
                            </button>
                        )}

                        <button onClick={() => profile(username)}>
                            profile
                        </button>
                        <button onClick={() => blockUser(username)}>
                            block
                        </button>
                    </div>
                );
            }
        }
    }

    const [display, setDisplay] = useState(-1);

    return (
        <ul id="chat-main-ul">
            {chat.messages.map((item: any, index: number) => (
                <li
                    className="chat-main-li"
                    key={index}
                    onMouseOver={() => {
                        setDisplay(index);
                    }}
                    onMouseLeave={() => {
                        setDisplay(-1);
                    }}
                >
                    <p className="chat-menu-channel chatMessages">
                        {item.username} :<br />
                        {item.message}
                    </p>
                    {display === index && messageMenu(item.username)}
                </li>
            ))}
        </ul>
    );
};
export default ChatMessages;
