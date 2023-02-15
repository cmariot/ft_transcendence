import { useContext } from "react";
import "../../CSS/Chat.css";
import axios from "axios";
import { ChatContext } from "./ChatParent";
import ChatMessage from "./ChatMessage";
import ChatMessages from "./ChatMessages";

const ChatConv = () => {
    const chat = useContext(ChatContext);

    function closeChat() {
        const current = document.getElementById("chat-conversation");
        let menu: HTMLElement | null;
        if (chat.previousMenu === "private") {
            menu = document.getElementById("chat-private-channels");
        } else {
            menu = document.getElementById("chat-your-channels");
        }
        if (menu && current) {
            current.style.display = "none";
            menu.style.display = "flex";
            const menu2 = document.getElementById("chat-menu-options");
            const messages = document.getElementById("chat-messages-list");
            const input = document.getElementById("send-message-form");

            if (menu2 && messages && input) {
                if (menu2.style.display === "flex") {
                    messages.style.display = "flex";
                    input.style.display = "flex";
                    menu2.style.display = "none";
                }
            }
        }
    }

    async function leaveChannel() {
        await axios
            .post("/api/chat/leave", { channelName: chat.currentChannel })
            .then(function (response) {
                chat.setCurrentChannelMessages([]);
                chat.changeCurrentChannel("");
                closeChat();
            })
            .catch(function (error) {
                console.log(error.response.data);
            });
    }

    function toogleChatMenu() {
        const menu = document.getElementById("chat-menu-options");
        const messages = document.getElementById("chat-messages-list");
        const input = document.getElementById("send-message-form");

        if (menu && messages && input) {
            if (menu.style.display === "flex") {
                messages.style.display = "flex";
                input.style.display = "flex";
                menu.style.display = "none";
            } else {
                messages.style.display = "none";
                menu.style.display = "flex";
                input.style.display = "none";
            }
        }
    }

    return (
        <menu id="chat-conversation" className="chat-menu">
            <header className="chat-header">
                <p className="chat-header-tittle">{chat.currentChannel}</p>
                <button onClick={toogleChatMenu}>menu</button>
            </header>
            <section id="chat-messages-list" className="chat-section">
                <ChatMessages />
            </section>
            <section id="chat-menu-options" className="chat-section">
                <button onClick={leaveChannel}>leave</button>
                <button onClick={closeChat}>close</button>
            </section>
            <footer className="chat-footer">
                <ChatMessage />
            </footer>
        </menu>
    );
};
export default ChatConv;
