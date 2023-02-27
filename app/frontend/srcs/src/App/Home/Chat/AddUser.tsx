import { ChangeEvent, useContext, useState } from "react";
import "../../CSS/Chat.css";
import axios from "axios";
import { ChatContext } from "./ChatParent";

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

    function returnToChatMenu() {
        const current = document.getElementById("add-user-menu");
        const menu = document.getElementById("chat-conversation");
        if (menu && current) {
            current.style.display = "none";
            menu.style.display = "flex";
        }
    }

    async function addNewUser(event: any) {
        event.preventDefault();
        await axios
            .post("/api/chat/private/add-user", {
                username: newUser,
                channelName: chat.currentChannel,
            })
            .then((response) => {
                console.log(response.data);
                setNewUser("");
            })
            .catch((error) => {
                alert(error.response.data.message);
            });
    }

    return (
        <menu id="add-user-menu" className="chat-menu">
            <header className="chat-header">
                <p className="chat-header-tittle">Add User</p>
                <button onClick={() => returnToChatMenu()}>return</button>
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
            </section>
            <footer className="chat-footer"></footer>
        </menu>
    );
};

export default AddUser;
