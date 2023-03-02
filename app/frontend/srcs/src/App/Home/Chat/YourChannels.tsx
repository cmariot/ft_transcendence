import { useContext } from "react";
import "../../CSS/Chat.css";
import axios from "axios";
import { ChatContext } from "./ChatParent";

// Display the list of channels the user joined and his private conversations
const YourChannels = () => {
    const chat = useContext(ChatContext);

    async function joinChannel(channel: string, channelType: string) {
        await axios
            .post("/api/chat/connect", { channelName: channel })
            .then(function (response) {
                chat.changeCurrentChannel(channel);
                chat.changeCurrentChannelType(channelType);
                chat.setCurrentChannelMessages(response.data.messages);
                chat.setChannelOwner(response.data.channel_owner);
                chat.setChannelAdmin(response.data.channel_admin);
                chat.setCurrentChannelAdmins(response.data.channel_admins);
                chat.setCurrentChannelMute(response.data.muted_users);
                chat.setCurrentChannelBan(response.data.banned_users);
                chat.setCurrentChannelUsers(
                    response.data.private_channel_users
                );
                const current = document.getElementById("chat-your-channels");
                const menu = document.getElementById("chat-conversation");
                if (menu && current) {
                    current.style.display = "none";
                    menu.style.display = "flex";
                }
            })
            .catch(function (error) {
                console.log("joinChannel error: ", error);
            });
    }

    function displayPrivateMessages() {
        if (chat.userPrivateChannels.size > 0) {
            return (
                <>
                    {Array.from(chat.userPrivateChannels).map((item, index) => (
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
                        </button>
                    ))}
                </>
            );
        }
    }

    function displayJoinedChannels() {
        if (chat.userChannels.size > 0) {
            return (
                <>
                    {Array.from(chat.userChannels).map((item, index) => (
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
                        </button>
                    ))}
                </>
            );
        }
    }

    function nothinToDisplay() {
        return (
            chat.userChannels.size === 0 && chat.userPrivateChannels.size === 0
        );
    }

    function displayChannels() {
        if (nothinToDisplay()) {
            return (
                <div id="no-channels">
                    <p>You haven't joined any channel yet</p>
                </div>
            );
        } else {
            return (
                <>
                    {displayJoinedChannels()}
                    {displayPrivateMessages()}
                </>
            );
        }
    }

    function viewChannelsList() {
        const current = document.getElementById("chat-your-channels");
        const menu = document.getElementById("chat-channels-list");
        if (menu && current) {
            current.style.display = "none";
            menu.style.display = "flex";
        }
    }

    function createChannelMenu() {
        const current = document.getElementById("chat-your-channels");
        const menu = document.getElementById("chat-create-channel");
        if (menu && current) {
            current.style.display = "none";
            menu.style.display = "flex";
        }
    }

    return (
        <menu id="chat-your-channels" className="chat-menu">
            <header className="chat-header">
                <p className="chat-header-tittle">Your channels</p>
                <button onClick={() => createChannelMenu()}>new channel</button>
            </header>
            <section className="chat-section">{displayChannels()}</section>
            <footer className="chat-footer">
                <button onClick={() => viewChannelsList()}>
                    browse channels
                </button>
            </footer>
        </menu>
    );
};
export default YourChannels;
