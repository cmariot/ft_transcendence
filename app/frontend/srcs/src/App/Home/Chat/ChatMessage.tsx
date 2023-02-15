import { ChangeEvent, useContext, useState } from "react";
import "../../CSS/Chat.css";
import axios from "axios";
import { ChatContext } from "./ChatParent";

const ChatMessage = () => {
    const chat = useContext(ChatContext);
    const [message, setMessage] = useState("");

    const handleMessageTyping = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const { id, value } = e.target;
        if (id === "chat-message-input") {
            setMessage(value);
        }
    };

    function sendMessage(e: any) {
        e.preventDefault();
        if (message.length === 0) return;
        axios
            .post("/api/chat", {
                channelName: chat.currentChannel,
                message: message,
            })
            .then((response) => {
                setMessage("");
                const chatMessages =
                    document.getElementById("chat-messages-list");
                if (chatMessages) {
                    chatMessages.scrollTo(0, chatMessages.scrollHeight);
                }
            })
            .catch((error) => {
                alert(
                    "You are not authorized to send a message on this channel."
                );
            });
    }

    return (
        <form onSubmit={sendMessage} id="send-message-form">
            <input
                id="chat-message-input"
                type="text"
                placeholder="message"
                value={message}
                onChange={handleMessageTyping}
                autoComplete="off"
                autoFocus
                required
            />
            <button type="submit">send</button>
        </form>
    );
};
export default ChatMessage;
