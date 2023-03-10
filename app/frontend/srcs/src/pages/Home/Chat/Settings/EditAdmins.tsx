import { ChangeEvent, useContext, useState } from "react";
import axios from "axios";
import { ChatContext } from "../../../../contexts/ChatProvider";

const EditAdmins = () => {
    const chat = useContext(ChatContext);
    const [newAdminName, setNewAdmin] = useState("");
    const [update, setUpdate] = useState(false);

    function handleNewsAdminChange(event: ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        const { id, value } = event.target;
        if (id === "new-admin-channel") {
            setNewAdmin(value);
        }
    }

    async function addAdministrator(event: any) {
        event.preventDefault();
        await axios
            .post("/api/chat/admin/add", {
                channelName: chat.channel,
                newAdminUsername: newAdminName,
            })
            .then(() => {
                let previousAdmins: string[] = chat.admins;
                previousAdmins.push(newAdminName);
                chat.setAdmins(previousAdmins);
                setNewAdmin("");
            })
            .catch((error) => {
                alert(error.response.data.message);
            });
    }

    async function removeAdmin(username: string, index: number) {
        await axios
            .post("/api/chat/admin/remove", {
                channelName: chat.channel,
                newAdminUsername: username,
            })
            .then(() => {
                let previousAdmins: string[] = chat.admins;
                previousAdmins.splice(index, 1);
                chat.setAdmins(previousAdmins);
                setUpdate(!update);
            })
            .catch((error) => {
                alert(error.response.data.message);
            });
    }

    function admins() {
        if (chat.admins.length) {
            return (
                <ul id="channel-admins-list">
                    <p>Administrators :</p>
                    {chat.admins.map((admin, index) => (
                        <li className="admin-channel" key={index}>
                            <p className="admin-channel-username">{admin}</p>
                            <button onClick={() => removeAdmin(admin, index)}>
                                remove
                            </button>
                        </li>
                    ))}
                </ul>
            );
        } else return <p>There is no administrators for this channel</p>;
    }

    return (
        <menu id="edit-admins-menu" className="chat-menu">
            <header className="chat-header">
                <p className="chat-header-tittle">Edit channel admins</p>
                <button onClick={() => chat.setPage("ChatConv")}>return</button>
            </header>
            <section className="chat-section">
                <form
                    onSubmit={(event) => addAdministrator(event)}
                    autoComplete="off"
                >
                    <input
                        type="text"
                        id="new-admin-channel"
                        onChange={handleNewsAdminChange}
                        value={newAdminName}
                        placeholder="new admin username"
                    />
                    <button type="submit" value="add">
                        add
                    </button>
                </form>
                {admins()}
            </section>
            <footer className="chat-footer"></footer>
        </menu>
    );
};

export default EditAdmins;
