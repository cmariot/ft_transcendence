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
                chat.changeCurrentChannel(channel);
                chat.setCurrentChannelMessages(response.data);
                const current = document.getElementById("chat-your-channels");
                const menu = document.getElementById("chat-conversation");
                if (menu && current) {
                    current.style.display = "none";
                    menu.style.display = "flex";
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function joinChannelMenu() {
        const current = document.getElementById("chat-your-channels");
        const menu = document.getElementById("chat-channels-list");
        if (menu && current) {
            current.style.display = "none";
            menu.style.display = "flex";
        }
    }

    function displayJoinedChannels() {
        if (chat.userPrivateChannels.size) {
            return (
                <>
                    <p>Your channels :</p>
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
                </>
            );
        }
    }

    function displayPrivateMessages() {
        if (chat.userPrivateChannels.size) {
            return (
                <>
                    <p>Private messages :</p>
                    {Array.from(chat.userPrivateChannels).map((item, index) => (
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
                </>
            );
        }
    }

    function displayChannels() {
        if (
            chat.userChannels.size === 0 &&
            chat.userPrivateChannels.size === 0
        ) {
            return (
                <section className="chat-section">
                    <div id="no-channels">
                        <p>You haven't joined any channel yet</p>
                    </div>
                </section>
            );
        } else {
            return (
                <section className="chat-section">
                    {displayJoinedChannels()}
                    {displayPrivateMessages()}
                </section>
            );
        }
    }

    return (
        <menu id="chat-your-channels" className="chat-menu">
            <header className="chat-header">
                <p className="chat-header-tittle">Your channels</p>

                <button onClick={() => joinChannelMenu()}>more</button>
            </header>
            {displayChannels()}
            <footer className="chat-footer"></footer>
        </menu>
    );
};
export default YourChannels;
