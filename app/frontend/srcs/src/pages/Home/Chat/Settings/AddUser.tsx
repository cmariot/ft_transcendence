import { ChangeEvent, useContext, useState } from "react";
import axios from "axios";
import { ChatContext } from "../../../../Contexts/ChatProvider";

const AddUser = () => {
    const chat = useContext(ChatContext);
    const [newUser, setNewUser] = useState("");

    function handleNewUser(event: ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        const { id, value } = event.target;
        if (id === "new-user-private-channel") {
            setNewUser(value);
        }
    }

    async function addNewUser(event: any) {
        event.preventDefault();
        await axios
            .post("/api/chat/private/add-user", {
                username: newUser,
                channelName: chat.channel,
            })
            .then((response) => {
                chat.setUsers(response.data);
                setNewUser("");
            })
            .catch((error) => {
                alert(error.response.data.message);
            });
    }

    async function kickUser(username: string) {
        await axios
            .post("/api/chat/kick", {
                channelName: chat.channel,
                username: username,
            })
            .then((response) => {
                if (chat.channelType === "privateChannel") {
                    chat.setUsers(response.data);
                }
            })
            .catch((error) => {
                alert(error.response.data.message);
            });
    }

    function currentUsers() {
        if (chat.users.length) {
            return (
                <ul id="channel-users-list">
                    <p>Channel users :</p>
                    {chat.users.map((user, index) => (
                        <li className="admin-channel" key={index}>
                            <p className="admin-channel-username">{user}</p>
                            <button onClick={() => kickUser(user)}>kick</button>
                        </li>
                    ))}
                </ul>
            );
        } else return <p>You are alone in this channel.</p>;
    }

    return (
        <menu id="add-user-menu" className="chat-menu">
            <header className="chat-header">
                <p className="chat-header-tittle">Add User</p>
                <button onClick={() => chat.setPage("ChatConv")}>return</button>
            </header>
            <section className="chat-section">
                <form
                    onSubmit={(event) => addNewUser(event)}
                    autoComplete="off"
                >
                    <input
                        type="text"
                        id="new-user-private-channel"
                        onChange={handleNewUser}
                        value={newUser}
                        placeholder="new username"
                    />
                    <button type="submit" value="add">
                        add
                    </button>
                </form>
                {currentUsers()}
            </section>
            <footer className="chat-footer"></footer>
        </menu>
    );
};

export default AddUser;
