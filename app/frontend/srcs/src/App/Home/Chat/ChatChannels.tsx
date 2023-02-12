import { useContext } from "react";
import "../../CSS/Chat.css";
import axios from "axios";
import { ChatContext } from "./ChatParent";

const ChatMenu = () => {
    const chat = useContext(ChatContext);

    function displayCreateChannel() {
        const menu = document.getElementById("chat-menu");
        const createChannel = document.getElementById("chat-create-channel");
        if (menu && createChannel) {
            menu.style.display = "none";
            createChannel.style.display = "flex";
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
                chat.changeCurrentChannel(channel);
                chat.setCurrentChannelMessages(response.data);
                closeChatMenu();
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
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
            </footer>
        </menu>
    );
};
export default ChatMenu;
