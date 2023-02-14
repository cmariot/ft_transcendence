import { useContext, useEffect } from "react";
import "../../CSS/Chat.css";
import { ChatContext } from "./ChatParent";
import { socket } from "../../../Contexts/WebsocketContext";
import { UserContext } from "../../App";

const ChatMessages = () => {
    const chat = useContext(ChatContext);
    const user = useContext(UserContext);

    function openConversationWith(event: any, username: string) {
        chat.startConversationWith(username);
        var chatMenu = document.getElementById("chat");
        var menu = document.getElementById("conversation-with-menu");
        if (chatMenu && menu) {
            if (chatMenu.style.display === "flex") {
                chatMenu.style.display = "none";
                menu.style.display = "flex";
            } else {
                menu.style.display = "flex";
                chatMenu.style.display = "none";
            }
        }

        console.log(username);
    }

    function messageMenu(username: string) {
        if (username !== user.username) {
            return (
                <div className="chat-user-message-options">
                    <button
                        onClick={(event) =>
                            openConversationWith(event, username)
                        }
                    >
                        message
                    </button>
                    <button>play</button>
                    <button>profile</button>
                    <button>block</button>
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
        <>
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
        </>
    );
};
export default ChatMessages;
