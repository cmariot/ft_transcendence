import { ChangeEvent, useState } from "react";
import "../../CSS/Chat.css";
import axios from "axios";

const ChatMessage = (props: any) => {
    const [message, setMessage] = useState("");

    const handleMessageTyping = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const { id, value } = e.target;
        if (id === "chat-message-input") {
            setMessage(value);
        }
    };

    function sendMessage() {
        axios
            .post("/api/chat/public", {
                channelName: props.channel,
                message: message,
            })
            .then((response) => {
                console.log("SEND MESSAGE: ", response);
                setMessage("");
            })
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
                value={message}
                onChange={handleMessageTyping}
            />
            <button onClick={sendMessage}>send</button>
        </>
    );
};
export default ChatMessage;
