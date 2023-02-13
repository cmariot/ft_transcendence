import { useContext, useEffect } from "react";
import "../../CSS/Chat.css";
import { ChatContext } from "./ChatParent";
import { socket } from "../../../Contexts/WebsocketContext";

const ChatMessages = () => {
    const chat = useContext(ChatContext);

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
                </li>
            ))}
        </ul>
    );
};
export default ChatMessages;
