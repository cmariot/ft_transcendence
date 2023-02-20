import { ChangeEvent, useContext, useState } from "react";
import "../../CSS/Chat.css";
import axios from "axios";
import { ChatContext } from "./ChatParent";

const BanUser = () => {
    const chat = useContext(ChatContext);
    const [newBanName, setNewBan] = useState("");
    const [banDuration, setBanDuration] = useState("600"); // default 10 minutes
    const [update, setUpdate] = useState(false);

    function handleNewsBanChange(event: ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        const { id, value } = event.target;
        if (id === "new-ban") {
            setNewBan(value);
        }
    }

    function handleBanTimeChange(event: any) {
        event.preventDefault();
        const { id, value } = event.target;
        if (id === "mute-duration") {
            setBanDuration(value);
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
                duration: banDuration,
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
                duration: "0",
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
                    <select
                        name="ban-duration"
                        id="mute-duration"
                        onChange={(event) => {
                            handleBanTimeChange(event);
                        }}
                    >
                        <option value="600">10 minutes</option>
                        <option value="86400">24 hours</option>
                        <option value="604800">7 days</option>
                        <option value="0">no limit</option>
                    </select>
                    <input type="submit" value="ban" />
                </form>
                {currentBannedUsers()}
            </section>
            <footer className="chat-footer"></footer>
        </menu>
    );
};

export default BanUser;
