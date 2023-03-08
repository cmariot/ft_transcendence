import { useContext } from "react";
import axios from "axios";
import { ChatContext } from "../../../Contexts/ChatProvider";

const ChannelsList = () => {
    const chat = useContext(ChatContext);

    async function joinChannel(channel: string, channelType: string) {
        if (channelType === "protected") {
            chat.setTargetChannel(channel);
            chat.setPage("JoinProtectedChannel");
        } else {
            await axios
                .post("/api/chat/connect", { channelName: channel })
                .then(function (response: any) {
                    chat.setChannel(channel);
                    chat.setChannelType(channelType);
                    chat.setMessages(response.data.messages);
                    chat.setisChannelOwner(response.data.channel_owner);
                    chat.setisChannelAdmin(response.data.channel_admin);
                    chat.setAdmins(response.data.channel_admins);
                    chat.setmutedUsers(response.data.muted_users);
                    chat.setbannedUsers(response.data.banned_users);
                    let userchannels = chat.userChannels;
                    userchannels.set(channel, { channelType: channelType });
                    chat.updateUserChannels(userchannels);
                    chat.closeMenu();
                    chat.setPage("ChatConv");
                })
                .catch(function (error) {
                    alert(error.response.data.message);
                });
        }
    }

    return (
        <menu id="chat-channels-list" className="chat-menu">
            <header className="chat-header">
                <p className="chat-header-tittle">Available channels</p>
            </header>
            <section className="chat-section">
                {chat.availableChannels.size ? (
                    <>
                        {Array.from(chat.availableChannels).map(
                            (item, index) => (
                                <button
                                    className="channel-selection-button"
                                    key={index}
                                    onClick={() =>
                                        joinChannel(
                                            item[0],
                                            item[1].channelType
                                        )
                                    }
                                >
                                    <p className="channel-selection-button-channel-name">
                                        {item[0]}
                                    </p>
                                    <p className="channel-selection-button-channel-type">
                                        {item[1].channelType ===
                                            "protected" && <>(protected)</>}
                                    </p>
                                </button>
                            )
                        )}
                    </>
                ) : (
                    <div id="no-channels">
                        <p>No channels available yet</p>
                    </div>
                )}
            </section>
            <footer className="chat-footer">
                <button onClick={() => chat.setPage("YourChannels")}>
                    cancel
                </button>
            </footer>
        </menu>
    );
};

export default ChannelsList;
