import { ChangeEvent, useContext, useState } from "react";
import axios from "axios";
import { ChatContext } from "../../../../contexts/chat/ChatContext";
import { MenuContext } from "../../../../contexts/menu/MenuContext";

const KickUser = () => {
    const chat = useContext(ChatContext);
    const menu = useContext(MenuContext);
    const [newKickName, setNewKickName] = useState("");

    function handleNewKickChange(event: ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        const { id, value } = event.target;
        if (id === "new-kick") {
            setNewKickName(value);
        }
    }

    async function kickUser(event: any) {
        event.preventDefault();
        await axios
            .post("/api/chat/kick", {
                channelName: chat.channel,
                username: newKickName,
            })
            .then((response) => {
                if (chat.channelType === "private") {
                    chat.setUsers(response.data);
                }
                setNewKickName("");
            })
            .catch((error) => {
                menu.displayError(error.response.data.message);
            });
    }

    return (
        <menu id="edit-kick" className="chat-menu">
            <header className="chat-header">
                <p className="chat-header-tittle">Kick</p>
                <button onClick={() => chat.setPage("ChatConv")}>return</button>
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
