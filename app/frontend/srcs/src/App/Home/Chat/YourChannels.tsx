import { useContext } from "react";
import "../../CSS/Chat.css";
import axios from "axios";
import { ChatContext } from "./ChatParent";

const YourChannels = () => {
    const chat = useContext(ChatContext);

    async function joinChannel(channel: string) {
        await axios
            .post("/api/chat/connect", { channelName: channel })
            .then(function (response) {
                chat.setCurrentChannelMessages([]);
                chat.changeCurrentChannel(channel);
                chat.setCurrentChannelMessages(response.data);
            })
            .catch(function (error) {});
    }

    function joinChannelMenu() {
        const current = document.getElementById("chat-your-channels");
        const menu = document.getElementById("chat-channels-list");
        if (menu && current) {
            current.style.display = "none";
            menu.style.display = "flex";
        }
    }

    function displayCreatePrivate() {
        const current = document.getElementById("chat-your-channels");
        const menu = document.getElementById("chat-create-private");
        if (menu && current) {
            current.style.display = "none";
            menu.style.display = "flex";
        }
    }

    function displayJoinedChannels() {
        if (chat.userChannels.size === 0) {
            return (
                <section className="chat-section">
                    <div id="no-channels">
                        <p>You haven't joined any channels yet</p>
                    </div>
                </section>
            );
        } else {
            return (
                <section className="chat-section">
                    {Array.from(chat.userChannels).map((item, index) => (
                        <button
                            className="channel-selection-button"
                            key={index}
                            onClick={() => joinChannel(item[0])}
                        >
                            <p className="channel-selection-button-channel-name">
                                {item[0]}
                            </p>
                        </button>
                    ))}
                </section>
            );
        }
    }

    function privateRequests() {
        let privateRequests: number = chat.userPrivateChannels.size;
        if (privateRequests === 1) {
            return <button>{chat.userPrivateChannels.size} request</button>;
        } else if (privateRequests > 0) {
            return <button>{chat.userPrivateChannels.size} requests</button>;
        }
    }

    return (
        <menu id="chat-your-channels" className="chat-menu">
            <header className="chat-header">
                <p className="chat-header-tittle">Your channels</p>
                {privateRequests()}
            </header>
            {displayJoinedChannels()}
            <footer className="chat-footer">
                <button onClick={() => joinChannelMenu()}>
                    other channels
                </button>
                <button onClick={displayCreatePrivate}>create private</button>
            </footer>
        </menu>
    );
};
export default YourChannels;
