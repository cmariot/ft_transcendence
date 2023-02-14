import { useContext } from "react";
import "../../CSS/Chat.css";
import axios from "axios";
import { ChatContext } from "./ChatParent";

const ChannelsList = () => {
    const chat = useContext(ChatContext);

    async function joinChannel(channel: string) {
        await axios
            .post("/api/chat/connect", { channelName: channel })
            .then(function (response) {
                chat.changeCurrentChannel(channel);
                chat.setCurrentChannelMessages(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function closeChannelsListMenu() {
        const current = document.getElementById("chat-channels-list");
        const menu = document.getElementById("chat-your-channels");
        if (menu && current) {
            current.style.display = "none";
            menu.style.display = "flex";
        }
    }

    function createChannelMenu() {
        const current = document.getElementById("chat-channels-list");
        const menu = document.getElementById("chat-create-channel");
        if (menu && current) {
            current.style.display = "none";
            menu.style.display = "flex";
        }
    }

    function displayIfProtected(channelType: string) {
        if (channelType === "protected") return <>(protected)</>;
    }

    function displayChannelsList() {
        if (chat.availableChannels.size === 0) {
            return (
                <section className="chat-section">
                    <div id="no-channels">
                        <p>No channels available yet</p>
                    </div>
                </section>
            );
        } else {
            return (
                <section className="chat-section">
                    {Array.from(chat.availableChannels).map((item, index) => (
                        <button
                            className="channel-selection-button"
                            key={index}
                            onClick={() => joinChannel(item[0])}
                        >
                            <p className="channel-selection-button-channel-name">
                                {item[0]}
                            </p>
                            <p className="channel-selection-button-channel-type">
                                {displayIfProtected(item[1].channelType)}
                            </p>
                        </button>
                    ))}
                </section>
            );
        }
    }

    return (
        <menu id="chat-channels-list" className="chat-menu">
            <header className="chat-header">
                <p className="chat-header-tittle">Channels List</p>
                <button onClick={() => createChannelMenu()}>new</button>
            </header>
            {displayChannelsList()}
            <footer className="chat-footer">
                <button onClick={() => closeChannelsListMenu()}>cancel</button>
            </footer>
        </menu>
    );
};
export default ChannelsList;
