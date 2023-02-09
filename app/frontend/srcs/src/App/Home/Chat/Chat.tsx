import { ChangeEvent, useEffect, useState } from "react";
import "../../CSS/Chat.css";
import ChatMenu from "./ChatMenu";
import CreateChannelMenu from "./CreateChannelsMenu";
import ChatMessages from "./ChatMessages";

const Chat = (props: any) => {
    const [chatTittle, setChatTittle] = useState("General");
    const [message, setMessage] = useState("");

    const handleMessageTyping = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const { id, value } = e.target;
        if (id === "chat-message-input") {
            setMessage(value);
        }
    };

    function toogleChatMenu() {
        var menu = document.getElementById("chat-menu");
        var app = document.getElementById("chat-main");
        var footer = document.getElementById("chat-footer");
        var createChatChannel = document.getElementById("chat-create-channel");
        if (createChatChannel) {
            createChatChannel.style.display = "none";
        }
        if (menu && app && footer) {
            if (menu.style.display === "flex") {
                setChatTittle("General");
                app.style.display = "flex";
                menu.style.display = "none";
                footer.style.display = "flex";
            } else {
                setChatTittle("Channels list");
                app.style.display = "none";
                menu.style.display = "flex";
                footer.style.display = "none";
            }
        }
    }

    function sendMessage() {
        setMessage("");
    }

    useEffect(() => {
        // Go to the bottom of the chat
        var chatMessages = document.getElementById("chat-main-ul");
        if (chatMessages) chatMessages.scrollTo(0, chatMessages.scrollHeight);
    }, []);

    return (
        <div id="chat">
            <>
                <header id="chat-header">
                    <p id="chat-channel">{chatTittle}</p>
                    <button onClick={toogleChatMenu}>menu</button>
                </header>
            </>
            <ChatMenu />
            <CreateChannelMenu />
            <ChatMessages />
            <footer id="chat-footer">
                <input
                    id="chat-message-input"
                    type="text"
                    placeholder="message"
                    value={message}
                    onChange={handleMessageTyping}
                />
                <button onClick={sendMessage}>send</button>
            </footer>
        </div>
    );
};
export default Chat;
