import { ChangeEvent, useEffect, useState } from "react";
import "../CSS/Chat.css";

const Chat = (props) => {
    const [message, setMessage] = useState("");

    const handleTyping = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (id === "chat-message-input") {
            setMessage(value);
        }
    };

    function sendMessage() {
        // Envoyer au gateway ici
        setMessage("");
    }

    useEffect(() => {}, [message]);

    return (
        <div id="chat">
            <div id="chat-content">
                <p>{message}</p>
            </div>
            <div id="chat-message">
                <input
                    id="chat-message-input"
                    type="text"
                    placeholder="message"
                    value={message}
                    onChange={handleTyping}
                />
                <input type="submit" value="send" onClick={sendMessage} />
            </div>
        </div>
    );
};
export default Chat;
