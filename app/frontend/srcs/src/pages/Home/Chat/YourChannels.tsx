import { useContext } from "react";
import axios from "axios";
import { ChatContext } from "../../../contexts/chat/ChatContext";

// Display the list of channels the user joined and his private conversations
const YourChannels = () => {
    const chat = useContext(ChatContext);

    async function connectChannel(channel: string, channelType: string) {
        await axios
            .post("/api/chat/connect", { channelName: channel })
            .then(function (response) {
                chat.setChannel(channel);
                chat.setChannelType(channelType);
                chat.setMessages(response.data.messages);
                chat.setisChannelOwner(response.data.channel_owner);
                chat.setisChannelAdmin(response.data.channel_admin);
                chat.setAdmins(response.data.channel_admins);
                chat.setmutedUsers(response.data.muted_users);
                chat.setbannedUsers(response.data.banned_users);
                chat.setUsers(response.data.private_channel_users);
                chat.setPage("ChatConv");
            })
            .catch(function (error) {
                console.log("joinChannel error: ", error);
            });
    }

    function displayJoinedChannels() {
        if (chat.userChannels.size)
            return (
                <>
                    {Array.from(chat.userChannels).map((item, index) => (
                        <button
                            className="channel-selection-button"
                            key={index}
                            onClick={() =>
                                connectChannel(item[0], item[1].channelType)
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

    function displayPrivateChannels() {
        return (
            <>
                {Array.from(chat.userPrivateChannels).map((item, index) => (
                    <button
                        className="channel-selection-button"
                        key={index}
                        onClick={() =>
                            connectChannel(item[0], item[1].channelType)
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

    function nothinToDisplay() {
        return (
            chat.userChannels.size === 0 && chat.userPrivateChannels.size === 0
        );
    }

    return (
        <menu id="chat-your-channels" className="chat-menu">
            <header className="chat-header">
                <p className="chat-header-tittle">Your channels</p>
                <button onClick={() => chat.setPage("CreateChannel")}>
                    new
                </button>
            </header>
            <section className="chat-section">
                {nothinToDisplay() ? (
                    <div id="no-channels">
                        <p>You haven't joined any channel yet</p>
                    </div>
                ) : (
                    <>
                        {displayJoinedChannels()}
                        {displayPrivateChannels()}
                    </>
                )}
            </section>
            <footer className="chat-footer">
                <button onClick={() => chat.setPage("ChannelsList")}>
                    browse
                </button>
            </footer>
        </menu>
    );
};

export default YourChannels;
