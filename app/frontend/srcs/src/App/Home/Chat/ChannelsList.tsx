import { useContext } from "react";
import "../../CSS/Chat.css";
import axios from "axios";
import { ChatContext } from "./ChatParent";

// Display the list of available channels (public and protected);
// The user cans join a channel, create a new one or go to the previous menu
// If there is no channels, a message is displayed ;
// If the user try to join a protected channel the password is asked.
const ChannelsList = () => {
    const chat = useContext(ChatContext);

    async function joinChannel(channel: string, channelType: string) {
        if (channelType === "protected") {
            chat.setTargetChannel(channel);
            const current = document.getElementById("chat-channels-list");
            const menu = document.getElementById("chat-join-protected");
            if (menu && current) {
                current.style.display = "none";
                menu.style.display = "flex";
            }
        } else {
            await axios
                .post("/api/chat/connect", { channelName: channel })
                .then(function (response) {
                    chat.changeCurrentChannel(channel);
                    chat.setCurrentChannelMessages(response.data);
                    const current =
                        document.getElementById("chat-channels-list");
                    const menu = document.getElementById("chat-conversation");
                    if (menu && current) {
                        current.style.display = "none";
                        menu.style.display = "flex";
                    }
                })
                .catch(function (error) {
                    console.log(error.response.message);
                });
        }
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
                <div id="no-channels">
                    <p>No channels available yet</p>
                </div>
            );
        } else {
            return (
                <>
                    {Array.from(chat.availableChannels).map((item, index) => (
                        <button
                            className="channel-selection-button"
                            key={index}
                            onClick={() =>
                                joinChannel(item[0], item[1].channelType)
                            }
                        >
                            <p className="channel-selection-button-channel-name">
                                {item[0]}
                            </p>
                            <p className="channel-selection-button-channel-type">
                                {displayIfProtected(item[1].channelType)}
                            </p>
                        </button>
                    ))}
                </>
            );
        }
    }

    return (
        <menu id="chat-channels-list" className="chat-menu">
            <header className="chat-header">
                <p className="chat-header-tittle">Available channels</p>
                <button onClick={() => closeChannelsListMenu()}>cancel</button>
            </header>
            <section className="chat-section">{displayChannelsList()}</section>
            <footer className="chat-footer">
                <button onClick={() => createChannelMenu()}>new</button>
            </footer>
        </menu>
    );
};

export default ChannelsList;
