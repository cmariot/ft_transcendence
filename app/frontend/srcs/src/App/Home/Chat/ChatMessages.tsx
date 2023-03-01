import { useContext } from "react";
import "../../CSS/Chat.css";
import { ChatContext } from "./ChatParent";
import { UserContext } from "../../App";
import axios, { HttpStatusCode } from "axios";
import { useNavigate } from "react-router-dom";

const ChatMessages = () => {
    const chat = useContext(ChatContext);
    const user = useContext(UserContext);
    const navigate = useNavigate();

    function createPrivateMenu() {
        const current = document.getElementById("chat-conversation");
        const menu = document.getElementById("chat-create-private");
        if (menu && current) {
            current.style.display = "none";
            menu.style.display = "flex";
        }
    }

    async function directMessage(username: string) {
        await axios
            .post("/api/chat/direct-message", { username: username })
            .then((response) => {
                if (response.status === HttpStatusCode.NoContent) {
                    chat.startConversationWith(username);
                    createPrivateMenu();
                    return;
                } else {
                    axios
                        .post("/api/chat/connect", {
                            channelName: response.data.channelName,
                        })
                        .then(function (response2) {
                            chat.changeCurrentChannel(
                                response.data.channelName
                            );
                            chat.changeCurrentChannelType(
                                response.data.channelType
                            );
                            chat.setCurrentChannelMessages(
                                response2.data.messages
                            );
                            chat.setChannelOwner(response2.data.channel_owner);
                            chat.setChannelAdmin(response2.data.channel_admin);
                            chat.setCurrentChannelAdmins(
                                response2.data.channel_admins
                            );
                            chat.setCurrentChannelMute(
                                response2.data.muted_users
                            );
                            chat.setCurrentChannelBan(
                                response2.data.banned_users
                            );
                            chat.setCurrentChannelUsers(
                                response2.data.private_channel_users
                            );
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
        await axios
            .post("/api/profile/block", { username: username })
            .then(async (response) => {
                user.setBlocked(response.data);
                await axios
                    .post("/api/chat/connect", {
                        channelName: chat.currentChannel,
                    })
                    .then((response) => {
                        chat.setCurrentChannelMessages(response.data.messages);
                        chat.setChannelOwner(response.data.channel_owner);
                        chat.setChannelAdmin(response.data.channel_admin);
                        chat.setCurrentChannelAdmins(
                            response.data.channel_admins
                        );
                        chat.setCurrentChannelMute(response.data.muted_users);
                        chat.setCurrentChannelBan(response.data.banned_users);
                    })
                    .catch((error) => {
                        console.log(error.data);
                    });
            })
            .catch((error) => {
                console.log(error.data);
            });
    }

    async function profile(username: string) {
        navigate("/profile/" + username);
    }

    function messageMenu(username: string) {
        if (username !== user.username) {
            if (chat.currentChannelType === "private") {
                return (
                    <div className="chat-user-message-options">
                        <button>play</button>
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
                        <button>play</button>
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

    return (
        <ul id="chat-main-ul">
            {chat.currentChannelMessages.map((item: any, index: any) => (
                <li className="chat-main-li" key={index}>
                    <p className="chat-menu-channel chatMessages">
                        {item.username} :<br />
                        {item.message}
                    </p>
                    {messageMenu(item.username)}
                </li>
            ))}
        </ul>
    );
};
export default ChatMessages;
