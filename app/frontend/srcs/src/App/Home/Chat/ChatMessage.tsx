import { ChangeEvent, useContext } from "react";
import "../../CSS/Chat.css";
import axios from "axios";
import ChatContext from "../../../Contexts/ChatContext";

const ChatMessage = () => {
    const chat = useContext(ChatContext);
    let message: string = "";

    const handleMessageTyping = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const { id, value } = e.target;
        if (id === "chat-message-input") {
            message = value;
        }
    };

    function sendMessage() {
        axios
            .post("/api/chat/public", {
                channelName: chat.currentChannel,
                message: message,
            })
            .then((response) => {})
            .catch((error) => {
                alert(
                    "You are not authorized to send a message on this channel."
                );
            });
    }

    return (
        <>
            <input
                id="chat-message-input"
                type="text"
                placeholder="message"
                onChange={handleMessageTyping}
            />
            <button onClick={sendMessage}>send</button>
        </>
    );
};
export default ChatMessage;
