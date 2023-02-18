import { ChangeEvent, useContext, useState } from "react";
import "../../CSS/Chat.css";
import axios from "axios";
import { ChatContext } from "./ChatParent";

const CreatePrivate = () => {
    const chat = useContext(ChatContext);

    const [newChannelName, setNewChannelName] = useState("");

    function handleNewChannelNameChange(event: ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        const { id, value } = event.target;
        if (id === "new-channel-name") {
            setNewChannelName(value);
        }
    }

    function cancelCreatePrivate() {
        const current = document.getElementById("chat-create-private");
        const menu = document.getElementById("chat-channels-list");
        if (menu && current) {
            current.style.display = "none";
            menu.style.display = "flex";
        }
    }

    const submitCreateChannelForm = async (event: any) => {
        event.preventDefault();
        if (newChannelName.length === 0) {
            alert("You must set a name for your new conversation");
            return;
        }
        await axios
            .post("/api/chat/create/private", {
                channelName: newChannelName,
                channelType: "private",
                allowed_users: [chat.conversationUser],
            })
            .then(function (response) {
                chat.changeCurrentChannel(newChannelName);
                chat.changeCurrentChannelType("private");
                chat.setCurrentChannelMessages([]);
                chat.setChannelOwner(true);
                chat.setCurrentChannelAdmins([]);
                const current = document.getElementById("chat-create-private");
                const menu = document.getElementById("chat-conversation");
                if (menu && current) {
                    current.style.display = "none";
                    menu.style.display = "flex";
                }
            })
            .catch(function (error) {
                alert(error.response.data.message);
            });
    };

    return (
        <menu id="chat-create-private" className="chat-menu">
            <header className="chat-header">
                <p className="chat-header-tittle">New private chat</p>
                <button onClick={cancelCreatePrivate}>cancel</button>
            </header>
            <section className="chat-section">
                <div id="chat-create-channel-form" className="chat-main">
                    <input
                        id="new-channel-name"
                        type="text"
                        placeholder="Channel's name"
                        value={newChannelName}
                        onChange={handleNewChannelNameChange}
                        autoComplete="off"
                        required
                    />
                </div>
            </section>
            <footer className="chat-footer">
                <input
                    id="submit-create-channel"
                    className="button"
                    type="submit"
                    value="create"
                    onClick={submitCreateChannelForm}
                />
            </footer>
        </menu>
    );
};

export default CreatePrivate;
