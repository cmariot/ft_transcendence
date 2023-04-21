import { useContext, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatMessages from "./ChatMessages";
import UserPannel from "./Pannels/UserPannel";
import OwnerPannel from "./Pannels/OwnerPannel";
import AdminPannel from "./Pannels/AdminPannel";
import { ChatContext } from "../../../contexts/chat/ChatContext";

const ChatConv = () => {
    const chat = useContext(ChatContext);

    useEffect(() => {
        const chatMessages = document.getElementById("chat-messages-list");
        if (chatMessages) {
            chatMessages.scrollTo(0, chatMessages.scrollHeight);
        }
    }, [chat.messages.length, document]);

    return (
        <menu id="chat-conversation" className="chat-menu">
            <header className="chat-header">
                <p className="chat-header-tittle">{chat.channel}</p>
                <button onClick={() => chat.toogleMenu()}>menu</button>
            </header>
            {chat.showMenu ? (
                <section id="chat-menu-options" className="chat-section">
                    {(chat.isChannelOwner || chat.isChannelAdmin) && (
                        <AdminPannel />
                    )}
                    {chat.isChannelOwner && <OwnerPannel />}
                    <UserPannel />
                </section>
            ) : (
                <section id="chat-messages-list" className="chat-section">
                    <ChatMessages />
                </section>
            )}
            <footer className="chat-footer">
                {!chat.showMenu && <ChatMessage />}
            </footer>
        </menu>
    );
};

export default ChatConv;
