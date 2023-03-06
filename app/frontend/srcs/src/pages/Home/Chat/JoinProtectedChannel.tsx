import { useContext, useState } from "react";
import axios from "axios";
import { ChatContext } from "./ChatParent";
type ChannelsListProps = {
    onChangeMenu: (newCurrentMenu: string | null) => void;
};
const JoinProtected = ({ onChangeMenu }: ChannelsListProps) => {
    const chat = useContext(ChatContext);
    const [password, setPassword] = useState("");

    function handleProtectedChange(event: any) {
        event.preventDefault();
        const { id, value } = event.target;
        if (id === "password-protected-channel") {
            setPassword(value);
        }
    }

    async function submitProtectedForm(event: any) {
        event.preventDefault();
        await axios
            .post("/api/chat/join/protected", {
                channelName: chat.targetChannel,
                channelPassword: password,
            })
            .then((response) => {
                chat.changeCurrentChannel(chat.targetChannel);
                chat.changeCurrentChannelType("protected");
                chat.setCurrentChannelMessages(response.data.messages);
                chat.setChannelOwner(response.data.channel_owner);
                chat.setChannelAdmin(response.data.channel_admin);
                chat.setCurrentChannelAdmins(response.data.channel_admins);
                chat.setCurrentChannelMute(response.data.muted_users);
                chat.setCurrentChannelBan(response.data.banned_users);
                let userchannels = chat.userChannels;
                userchannels.set(chat.targetChannel, {
                    channelType: "protected",
                });
                let availablechannels = chat.availableChannels;
                availablechannels.delete(chat.targetChannel);
                chat.updateUserChannels(userchannels);
                onChangeMenu("ChatConv");
                setPassword("");
            })
            .catch((error) => {
                setPassword("");
                alert(error.response.data.message);
            });
    }

    function closeJoinMenu() {
        onChangeMenu("ChannelsList");
    }

    return (
        <menu id="chat-join-protected" className="chat-menu">
            <header className="chat-header">
                <p className="chat-header-tittle">Join protected channel</p>
                <button onClick={closeJoinMenu}>cancel</button>
            </header>
            <section
                className="chat-section"
                id="join-protected-channel-section"
            >
                <p>Enter the {chat.targetChannel}'s password :</p>
                <form onSubmit={submitProtectedForm} autoComplete="off">
                    <input
                        type="password"
                        id="password-protected-channel"
                        placeholder={chat.targetChannel.concat(" password")}
                        value={password}
                        onChange={handleProtectedChange}
                        autoComplete="off"
                        required
                    />
                </form>
            </section>
            <footer className="chat-footer">
                <button
                    type="submit"
                    className="button"
                    onClick={submitProtectedForm}
                >
                    join
                </button>
            </footer>
        </menu>
    );
};
export default JoinProtected;
