import { ChangeEvent, useContext, useState } from "react";
import axios from "axios";
import { ChatContext } from "../../../../Contexts/ChatProvider";

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

    async function banUser(event: any) {
        event.preventDefault();
        await axios
            .post("/api/chat/ban", {
                channelName: chat.channel,
                username: newBanName,
                duration: banDuration,
            })
            .then((response) => {
                chat.setbannedUsers(response.data);
                setNewBan("");
            })
            .catch((error) => {
                alert(error.response.data.message);
            });
    }

    async function unban(username: string, index: number) {
        await axios
            .post("/api/chat/unban", {
                channelName: chat.channel,
                username: username,
                duration: "0",
            })
            .then((response) => {
                chat.setbannedUsers(response.data);
                setUpdate(!update);
            })
            .catch((error) => {
                alert(error.response.data.message);
            });
    }

    function currentBannedUsers() {
        if (chat.bannedUsers.length) {
            return (
                <ul id="channel-ban-list">
                    <p>Banned users :</p>
                    {chat.bannedUsers.map((ban, index) => (
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
                <button onClick={() => chat.setPage("ChatConv")}>return</button>
            </header>
            <section className="chat-section">
                <form onSubmit={(event) => banUser(event)} autoComplete="off">
                    <input
                        type="text"
                        id="new-ban"
                        onChange={handleNewsBanChange}
                        value={newBanName}
                        placeholder="ban username"
                    />
                    <select
                        name="ban-duration"
                        id="ban-duration"
                        onChange={(event) => {
                            handleBanTimeChange(event);
                        }}
                    >
                        <option value="600">10 minutes</option>
                        <option value="86400">24 hours</option>
                        <option value="604800">7 days</option>
                        <option value="0">ban def</option>
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
