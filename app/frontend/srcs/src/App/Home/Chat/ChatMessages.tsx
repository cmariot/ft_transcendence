import { useContext, useEffect } from "react";
import "../../CSS/Chat.css";
import { ChatContext } from "./ChatParent";
import { socket } from "../../../Contexts/WebsocketContext";
import { UserContext } from "../../App";
import axios from "axios";

const ChatMessages = () => {
    const chat = useContext(ChatContext);
    const user = useContext(UserContext);

    async function directMessage(username: string) {
        await axios
            .post("/api/chat/direct-message", { username: username })
            .then((response) => console.log(response.data.message))
            .catch((error) => console.log(error));
        //chat.startConversationWith(username);
        //var chatMenu = document.getElementById("chat");
        //var menu = document.getElementById("conversation-with-menu");
        //if (chatMenu && menu) {
        //    if (chatMenu.style.display === "flex") {
        //        chatMenu.style.display = "none";
        //        menu.style.display = "flex";
        //    } else {
        //        menu.style.display = "flex";
        //        chatMenu.style.display = "none";
        //    }
        //}
    }

    async function blockUser(username: string) {
        await axios
            .post("/api/profile/block", { username: username })
            .then(async (response) => {
                user.setBlocked(response.data);
                console.log(response.data);
                await axios
                    .post("/api/chat/connect", {
                        channelName: chat.currentChannel,
                    })
                    .then((response) => {
                        chat.setCurrentChannelMessages(response.data);
                        console.log(response.data);
                    })
                    .catch((error) => {
                        console.log(error.data);
                    });
            })
            .catch((error) => {
                console.log(error.data);
            });
    }

    function messageMenu(username: string) {
        if (username !== user.username) {
            return (
                <div className="chat-user-message-options">
                    <button onClick={() => directMessage(username)}>
                        message
                    </button>
                    <button>play</button>
                    <button>profile</button>
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
