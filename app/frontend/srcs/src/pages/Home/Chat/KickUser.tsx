import { ChangeEvent, useContext, useState } from "react";
import axios from "axios";
import { ChatContext } from "./ChatParent";
type ChannelsListProps = {
    onChangeMenu: (newCurrentMenu: string | null) => void;
};
const KickUser = ({ onChangeMenu }: ChannelsListProps) => {
    const chat = useContext(ChatContext);
    const [newKickName, setNewKickName] = useState("");

    function handleNewKickChange(event: ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        const { id, value } = event.target;
        if (id === "new-kick") {
            setNewKickName(value);
        }
    }

    function returnToChatMenu() {
        const current = document.getElementById("edit-kick");
        const menu = document.getElementById("chat-conversation");
        if (menu && current) {
            current.style.display = "none";
            menu.style.display = "flex";
        }
    }

    async function kickUser(event: any) {
        event.preventDefault();
        await axios
            .post("/api/chat/kick", {
                channelName: chat.currentChannel,
                username: newKickName,
            })
            .then((response) => {
                if (chat.currentChannelType === "privateChannel") {
                    chat.setCurrentChannelUsers(response.data);
                }
                setNewKickName("");
            })
            .catch((error) => {
                alert(error.response.data.message);
            });
    }

    return (
        <menu id="edit-kick" className="chat-menu">
            <header className="chat-header">
                <p className="chat-header-tittle">Kick</p>
                <button onClick={() => returnToChatMenu()}>return</button>
            </header>
            <section className="chat-section">
                <form onSubmit={(event) => kickUser(event)} autoComplete="off">
                    <input
                        type="text"
                        id="new-kick"
                        onChange={handleNewKickChange}
                        value={newKickName}
                        placeholder="kick username"
                    />
                    <input type="submit" value="kick" />
                </form>
            </section>
            <footer className="chat-footer"></footer>
        </menu>
    );
};

export default KickUser;
