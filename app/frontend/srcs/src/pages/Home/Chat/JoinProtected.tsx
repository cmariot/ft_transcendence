import { useContext, useState } from "react";
import axios from "axios";
import { ChatContext } from "../../../contexts/chat/ChatContext";
import { MenuContext } from "../../../contexts/menu/MenuContext";

const JoinProtected = () => {
    const chat = useContext(ChatContext);
    const [password, setPassword] = useState("");
    const menu = useContext(MenuContext);

    function handlePasswordChange(event: any) {
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
                chat.setChannel(chat.targetChannel);
                chat.setChannelType("protected");
                chat.setMessages(response.data.messages);
                chat.setisChannelOwner(response.data.channel_owner);
                chat.setisChannelAdmin(response.data.channel_admin);
                chat.setAdmins(response.data.channel_admins);
                chat.setmutedUsers(response.data.muted_users);
                chat.setbannedUsers(response.data.banned_users);
                let userchannels = chat.userChannels;
                userchannels.set(chat.targetChannel, {
                    channelType: "protected",
                });
                let availablechannels = chat.availableChannels;
                availablechannels.delete(chat.targetChannel);
                chat.updateUserChannels(userchannels);
                chat.closeMenu();
                chat.setPage("ChatConv");
                setPassword("");
            })
            .catch((error) => {
                setPassword("");
                menu.displayError(error.response.data.message);
            });
    }

    return (
        <menu id="chat-join-protected" className="chat-menu">
            <header className="chat-header">
                <p className="chat-header-tittle">Join protected channel</p>
                <button onClick={() => chat.setPage("ChannelsList")}>
                    cancel
                </button>
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
                        onChange={handlePasswordChange}
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
