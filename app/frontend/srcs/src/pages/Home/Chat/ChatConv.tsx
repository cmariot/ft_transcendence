import { useContext, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatMessages from "./ChatMessages";
import { ChatContext } from "../../../contexts/ChatProvider";
import UserPannel from "./Pannels/UserPannel";
import OwnerPannel from "./Pannels/OwnerPannel";
import AdminPannel from "./Pannels/AdminPannel";

const ChatConv = () => {
    const chat = useContext(ChatContext);

    useEffect(() => {
        if (chat.isBan === true || chat.isChannelDeleted === true) {
            chat.setChannel("");
            chat.setPage("YourChannels");
            if (chat.isBan === true) {
                chat.setIsBan(false);
            } else if (chat.isChannelDeleted === true) {
                chat.setisChannelDeleted(false);
            }
        }
    }, [chat]);

    useEffect(() => {
        const chatMessages = document.getElementById("chat-messages-list");
        if (chatMessages) {
            chatMessages.scrollTo(0, chatMessages.scrollHeight);
        }
    });

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
