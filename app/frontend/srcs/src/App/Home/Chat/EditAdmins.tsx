import { ChangeEvent, useContext, useEffect, useState } from "react";
import "../../CSS/Chat.css";
import axios from "axios";
import { ChatContext } from "./ChatParent";

const EditAdmins = () => {
    const chat = useContext(ChatContext);
    const [newAdminName, setNewAdmin] = useState("");

    function handleNewsAdminChange(event: ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        const { id, value } = event.target;
        if (id === "new-admin-channel") {
            setNewAdmin(value);
        }
    }

    function returnToChatMenu() {
        const current = document.getElementById("edit-admins-menu");
        const menu = document.getElementById("chat-conversation");
        if (menu && current) {
            current.style.display = "none";
            menu.style.display = "flex";
        }
    }

    async function addAdministrator(event: any) {
        event.preventDefault();
        await axios
            .post("/api/chat/admin/add", {
                channelName: chat.currentChannel,
                newAdminUsername: newAdminName,
            })
            .then(() => {
                let previousAdmins: string[] = chat.currentChannelAdmins;
                previousAdmins.push(newAdminName);
                chat.setCurrentChannelAdmins(previousAdmins);
                setNewAdmin("");
            })
            .catch((error) => {
                alert(error.response.data.message);
            });
    }

    function currentChannelAdmins() {
        return chat.currentChannelAdmins.map((admin, index) => (
            <li className="admin-channel" key={index}>
                <p className="admin-channel-username">{admin}</p>
            </li>
        ));
    }

    return (
        <menu id="edit-admins-menu" className="chat-menu">
            <header className="chat-header">
                <p className="chat-header-tittle">Edit channel admins</p>
                <button onClick={() => returnToChatMenu()}>cancel</button>
            </header>
            <section className="chat-section">
                <form onSubmit={(event) => addAdministrator(event)}>
                    <input
                        type="text"
                        id="new-admin-channel"
                        onChange={handleNewsAdminChange}
                        placeholder="new administrator username"
                    />
                    <input type="submit" value="add" />
                    {currentChannelAdmins()}
                </form>
            </section>
            <footer className="chat-footer"></footer>
        </menu>
    );
};

export default EditAdmins;
