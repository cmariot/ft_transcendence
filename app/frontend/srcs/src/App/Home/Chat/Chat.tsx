import { useContext, useEffect } from "react";
import "../../CSS/Chat.css";
import ChatMenu from "./ChatChannels";
import CreateChannelMenu from "./CreateChannelsMenu";
import ChatMessages from "./ChatMessages";
import ChatMessage from "./ChatMessage";
import { ChatContext } from "./ChatParent";
import CreatePrivateMenu from "./CreatePrivateMenu";

const Chat = () => {
    let chat = useContext(ChatContext);

    function toogleChatMenu() {
        var chat = document.getElementById("chat");
        var menu = document.getElementById("chat-menu");
        if (chat && menu) {
            if (chat.style.display === "flex") {
                chat.style.display = "none";
                menu.style.display = "flex";
            } else {
                menu.style.display = "flex";
                chat.style.display = "none";
            }
        }
    }

    useEffect(() => {
        var chatMessages = document.getElementById("chat-main-ul");
        if (chatMessages) chatMessages.scrollTo(0, chatMessages.scrollHeight);
    });

    return (
        <div id="chat-section">
            <menu id="chat" className="chat-section">
                <header id="chat-header" className="chat-header">
                    <p id="chat-channel">{chat.currentChannel}</p>
                    <button onClick={toogleChatMenu}>change</button>
                </header>
                <main id="chat-main" className="chat-main">
                    <ChatMessages />
                </main>
                <footer id="chat-footer" className="chat-footer">
                    <ChatMessage />
                </footer>
            </menu>
            <ChatMenu />
            <CreateChannelMenu />
            <CreatePrivateMenu />
        </div>
    );
};

export default Chat;
