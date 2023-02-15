import { useContext, useState } from "react";
import "../../CSS/Chat.css";
import axios from "axios";
import { ChatContext } from "./ChatParent";

const JoinProtected = () => {
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
                setPassword("");
                chat.changeCurrentChannel(chat.targetChannel);
                chat.setCurrentChannelMessages(response.data);
                const current = document.getElementById("chat-join-protected");
                const menu = document.getElementById("chat-conversation");
                if (menu && current) {
                    current.style.display = "none";
                    menu.style.display = "flex";
                }
            })
            .catch((error) => {
                setPassword("");
                alert(error.response.data.message);
            });
    }

    function closeJoinMenu() {
        const current = document.getElementById("chat-join-protected");
        const menu = document.getElementById("chat-channels-list");
        if (menu && current) {
            current.style.display = "none";
            menu.style.display = "flex";
        }
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
                <form onSubmit={submitProtectedForm}>
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
