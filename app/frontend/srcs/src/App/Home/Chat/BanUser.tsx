import { ChangeEvent, useContext, useState } from "react";
import "../../CSS/Chat.css";
import axios from "axios";
import { ChatContext } from "./ChatParent";

const BanUser = () => {
    const chat = useContext(ChatContext);
    const [newBanName, setNewBan] = useState("");
    const [update, setUpdate] = useState(false);

    function handleNewsBanChange(event: ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        const { id, value } = event.target;
        if (id === "new-ban") {
            setNewBan(value);
        }
    }

    function returnToChatMenu() {
        const current = document.getElementById("edit-ban");
        const menu = document.getElementById("chat-conversation");
        if (menu && current) {
            current.style.display = "none";
            menu.style.display = "flex";
        }
    }

    async function banUser(event: any) {
        event.preventDefault();
        await axios
            .post("/api/chat/ban", {
                channelName: chat.currentChannel,
                username: newBanName,
            })
            .then(() => {
                let previousBanned: string[] = chat.currentChannelBan;
                previousBanned.push(newBanName);
                chat.setCurrentChannelBan(previousBanned);
                chat.setCurrentChannelAdmins(previousBanned);
                setNewBan("");
            })
            .catch((error) => {
                alert(error.response.data.message);
            });
    }

    async function unban(username: string, index: number) {
        await axios
            .post("/api/chat/unban", {
                channelName: chat.currentChannel,
                username: username,
            })
            .then(() => {
                let previousBanned: string[] = chat.currentChannelBan;
                previousBanned.splice(index, 1);
                chat.setCurrentChannelBan(previousBanned);
                setUpdate(!update);
            })
            .catch((error) => {
                alert(error.response.data.message);
            });
    }

    function currentBannedUsers() {
        if (chat.currentChannelBan.length) {
            return (
                <ul id="channel-ban-list">
                    <p>Banned users :</p>
                    {chat.currentChannelBan.map((ban, index) => (
                        <li className="admin-channel" key={index}>
                            <p className="admin-channel-username">{ban}</p>
                            <button onClick={() => unban(ban, index)}>
                                unban
                            </button>
                        </li>
                    ))}
                </ul>
            );
        } else return <p>Nobody is banned in this channel.</p>;
    }

    return (
        <menu id="edit-ban" className="chat-menu">
            <header className="chat-header">
                <p className="chat-header-tittle">Ban</p>
                <button onClick={() => returnToChatMenu()}>return</button>
            </header>
            <section className="chat-section">
                <form onSubmit={(event) => banUser(event)}>
                    <input
                        type="text"
                        id="new-ban"
                        onChange={handleNewsBanChange}
                        value={newBanName}
                        placeholder="ban username"
                    />
                    <input type="submit" value="ban" />
                </form>
                {currentBannedUsers()}
            </section>
            <footer className="chat-footer"></footer>
        </menu>
    );
};

export default BanUser;
