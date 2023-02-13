import { useContext, useEffect, useState } from "react";
import "../../CSS/Chat.css";
import axios from "axios";
import { ChatContext } from "./ChatParent";
import JoinProtectedMenu from "./JoinProtectedChannel";

const ChatMenu = () => {
    const chat = useContext(ChatContext);
    const [joinChannelName, setJoinChannelName] = useState("");

    function displayCreateChannel() {
        const menu = document.getElementById("chat-menu");
        const createChannel = document.getElementById("chat-create-channel");
        if (menu && createChannel) {
            menu.style.display = "none";
            createChannel.style.display = "flex";
        }
    }

    function displayCreatePrivate() {
        const menu = document.getElementById("chat-menu");
        const createPrivate = document.getElementById("chat-create-private");
        if (menu && createPrivate) {
            menu.style.display = "none";
            createPrivate.style.display = "flex";
        }
    }

    function closeChatMenu() {
        var chat = document.getElementById("chat");
        var menu = document.getElementById("chat-menu");
        if (chat && menu) {
            menu.style.display = "none";
            chat.style.display = "flex";
        }
    }

    async function joinChannel(channel: string) {
        await axios
            .post("/api/chat/connect", { channelName: channel })
            .then(function (response) {
                chat.setCurrentChannelMessages([]);
                closeChatMenu();
                chat.changeCurrentChannel(channel);
                chat.setCurrentChannelMessages(response.data);
            })
            .catch(function (error) {
                if (
                    error.response &&
                    error.response.data &&
                    error.response.data.statusCode &&
                    error.response.data.message &&
                    error.response.data.statusCode === 302 &&
                    error.response.data.message ===
                        "Enter the channel's password"
                ) {
                    var passwordMenu = document.getElementById(
                        "chat-join-protected"
                    );
                    var menu = document.getElementById("chat-menu");
                    if (passwordMenu && menu) {
                        menu.style.display = "none";
                        passwordMenu.style.display = "flex";
                    }
                    setJoinChannelName(channel);
                }
            });
    }

    useEffect(() => {
        var chatChannels = document.getElementById("chat-menu-channels");
        if (chatChannels) chatChannels.scrollTo(0, 0);
    });

    return (
        <>
            <menu id="chat-menu" className="chat-section">
                <header id="chat-menu-header" className="chat-header">
                    <p id="chat-channel">Channels List</p>
                    <button onClick={closeChatMenu}>cancel</button>
                </header>
                <div id="chat-menu-channels" className="chat-main">
                    {Array.from(chat.availableChannels).map((item, index) => (
                        <button
                            className="chat-menu-li"
                            key={index}
                            onClick={() => joinChannel(item[0])}
                        >
                            <p className="chat-menu-channel">{item[0]}</p>
                            <p className="chat-menu-channel">
                                ({item[1].channelType})
                            </p>
                        </button>
                    ))}
                </div>
                <footer id="chat-menu-buttons" className="chat-footer">
                    <button onClick={displayCreateChannel}>new channel</button>
                    <button onClick={displayCreatePrivate}>
                        private conversation
                    </button>
                </footer>
            </menu>

            <JoinProtectedMenu channel={joinChannelName} />
        </>
    );
};
export default ChatMenu;
