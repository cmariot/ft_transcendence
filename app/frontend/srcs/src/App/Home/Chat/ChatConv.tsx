import { useContext, useEffect } from "react";
import "../../CSS/Chat.css";
import axios from "axios";
import { ChatContext } from "./ChatParent";
import ChatMessage from "./ChatMessage";
import ChatMessages from "./ChatMessages";

const ChatConv = () => {
    const chat = useContext(ChatContext);

    function closeChat() {
        const current = document.getElementById("chat-conversation");
        const current2 = document.getElementById("chat-menu-options");
        const menu = document.getElementById("chat-your-channels");
        if (menu && current && current2) {
            // Close the chat conv
            current.style.display = "none";
            menu.style.display = "flex";
            // Close the chat menu if open
            if (current2.style.display === "flex") {
                toogleChatMenu();
            }
        }
    }

    useEffect(() => {
        if (chat.ban === true) {
            const current = document.getElementById("chat-conversation");
            const current2 = document.getElementById("chat-menu-options");
            const menu = document.getElementById("chat-your-channels");
            if (menu && current && current2) {
                current.style.display = "none";
                menu.style.display = "flex";
                if (current2.style.display === "flex") {
                    toogleChatMenu();
                }
            }
            chat.changeCurrentChannel("");
            chat.setBan(false);
        }
        if (chat.channelDeleted === true) {
            const current = document.getElementById("chat-conversation");
            const current2 = document.getElementById("chat-menu-options");
            const menu = document.getElementById("chat-your-channels");
            if (menu && current && current2) {
                current.style.display = "none";
                menu.style.display = "flex";
                if (current2.style.display === "flex") {
                    toogleChatMenu();
                }
            }
            chat.changeCurrentChannel("");
            chat.setChannelDeleted(false);
        }
    }, [chat]);

    async function leaveChannel() {
        await axios
            .post("/api/chat/leave", { channelName: chat.currentChannel })
            .then(function (response) {
                chat.setCurrentChannelMessages([]);
                chat.changeCurrentChannel("");
                chat.changeCurrentChannelType("");
                chat.setCurrentChannelMute([]);
                chat.setCurrentChannelBan([]);
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

    useEffect(() => {
        const chatMessages = document.getElementById("chat-messages-list");
        if (chatMessages) {
            chatMessages.scrollTo(0, chatMessages.scrollHeight);
        }
    });

    function displayChannelPasswordMenu() {
        const current = document.getElementById("chat-conversation");
        const menu = document.getElementById("change-channel-password");
        if (menu && current) {
            current.style.display = "none";
            menu.style.display = "flex";
        }
    }

    function displayEditAdminsMenu() {
        const current = document.getElementById("chat-conversation");
        const menu = document.getElementById("edit-admins-menu");
        if (menu && current) {
            current.style.display = "none";
            menu.style.display = "flex";
        }
    }

    function displayBanMenu() {
        const current = document.getElementById("chat-conversation");
        const menu = document.getElementById("edit-ban");
        if (menu && current) {
            current.style.display = "none";
            menu.style.display = "flex";
        }
    }

    function displayMuteMenu() {
        const current = document.getElementById("chat-conversation");
        const menu = document.getElementById("edit-mute");
        if (menu && current) {
            current.style.display = "none";
            menu.style.display = "flex";
        }
    }

    function adminPannel() {
        if (
            (chat.channelOwner === true || chat.channelAdmin === true) &&
            chat.currentChannelType !== "private"
        ) {
            return (
                <>
                    <button onClick={() => displayMuteMenu()}>
                        mute an user
                    </button>
                    <button onClick={() => displayBanMenu()}>
                        ban an user
                    </button>
                </>
            );
        }
        return null;
    }

    function ownerPannel() {
        if (
            chat.channelOwner === true &&
            chat.currentChannelType !== "private"
        ) {
            return (
                <>
                    <button onClick={() => displayChannelPasswordMenu()}>
                        edit channel's password
                    </button>
                    <button onClick={() => displayEditAdminsMenu()}>
                        edit channel's administrators
                    </button>
                </>
            );
        }
        return null;
    }

    function userPannel() {
        if (chat.channelOwner === true) {
            return (
                <>
                    <button onClick={leaveChannel}>
                        leave this channel and delete it
                    </button>
                    <button onClick={closeChat}>return to channels list</button>
                </>
            );
        } else if (chat.currentChannelType === "private") {
            return (
                <>
                    <button onClick={leaveChannel}>
                        leave this channel and delete it
                    </button>
                    <button onClick={closeChat}>return to channels list</button>
                </>
            );
        } else {
            return (
                <>
                    <button onClick={leaveChannel}>leave</button>
                    <button onClick={closeChat}>return to channels list</button>
                </>
            );
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
                {adminPannel()}
                {ownerPannel()}
                {userPannel()}
            </section>
            <footer className="chat-footer">
                <ChatMessage />
            </footer>
        </menu>
    );
};

export default ChatConv;
