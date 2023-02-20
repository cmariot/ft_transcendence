import { useContext, useEffect } from "react";
import "../../CSS/Chat.css";
import { ChatContext } from "./ChatParent";
import { socket } from "../../../Contexts/WebsocketContext";
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
                    chat.changeCurrentChannel(response.data.channelName);
                    chat.setCurrentChannelMessages(response.data.data.messages);
                    chat.setChannelOwner(response.data.data.channel_owner);
                    chat.changeCurrentChannelType("private");
                    chat.setCurrentChannelAdmins(
                        response.data.data.channel_admins
                    );
                    chat.setCurrentChannelMute(response.data.data.muted_users);
                    chat.setCurrentChannelBan(response.data.data.banned_users);
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
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error.data);
            });
        await axios
            .post("/api/chat/connect", {
                channelName: chat.currentChannel,
            })
            .then((response) => {
                chat.setCurrentChannelMessages(response.data.messages);
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
            return (
                <div className="chat-user-message-options">
                    <button onClick={() => directMessage(username)}>
                        message
                    </button>
                    <button>play</button>
                    <button onClick={() => profile(username)}>profile</button>
                    <button onClick={() => blockUser(username)}>block</button>
                </div>
            );
        }
    }

    useEffect(() => {
        socket.on("newChatMessage", (socket) => {
            const socketChannel: string = socket.channel;
            if (socketChannel === chat.currentChannel) {
                const previousMessages: {
                    username: string;
                    message: string;
                }[] = [];
                chat.currentChannelMessages.forEach((val) =>
                    previousMessages.push(Object.assign({}, val))
                );
                previousMessages.push(
                    Object.assign(
                        {},
                        { username: socket.username, message: socket.message }
                    )
                );
                chat.setCurrentChannelMessages(previousMessages);
            }
        });
    }, [chat]);

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
