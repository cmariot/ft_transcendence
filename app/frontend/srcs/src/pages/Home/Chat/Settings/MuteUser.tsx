import { ChangeEvent, useContext, useState } from "react";
import axios from "axios";
import { ChatContext } from "../../../../contexts/ChatProvider";

const MuteUser = () => {
    const chat = useContext(ChatContext);
    const [newMute, setNewMute] = useState("");
    const [muteDuration, setMuteDuration] = useState("600"); // default 10 minutes
    const [update, setUpdate] = useState(false);

    function handleNewMuteChange(event: ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        const { id, value } = event.target;
        if (id === "new-mute-input") {
            setNewMute(value);
        }
    }

    function handleMuteTimeChange(event: any) {
        event.preventDefault();
        const { id, value } = event.target;
        if (id === "mute-duration") {
            setMuteDuration(value);
        }
    }

    async function muteUser(event: any) {
        event.preventDefault();
        await axios
            .post("/api/chat/mute", {
                channelName: chat.channel,
                username: newMute,
                duration: muteDuration,
            })
            .then((response) => {
                chat.setmutedUsers(response.data);
                setNewMute("");
            })
            .catch((error) => {
                alert(error.response.data.message);
            });
    }

    async function unmute(username: string, index: number) {
        await axios
            .post("/api/chat/unmute", {
                channelName: chat.channel,
                username: username,
                duration: "0",
            })
            .then((response) => {
                chat.setmutedUsers(response.data);
                setUpdate(!update);
            })
            .catch((error) => {
                alert(error.response.data.message);
            });
    }

    function currentMutedUsers() {
        if (chat.mutedUsers.length) {
            return (
                <ul id="channel-admins-list">
                    <p>Muted users :</p>
                    {chat.mutedUsers.map((mute, index) => (
                        <li className="admin-channel" key={index}>
                            <p className="admin-channel-username">{mute}</p>
                            <button onClick={() => unmute(mute, index)}>
                                unmute
                            </button>
                        </li>
                    ))}
                </ul>
            );
        } else return <p>Nobody is muted in this channel.</p>;
    }

    return (
        <menu id="edit-mute" className="chat-menu">
            <header className="chat-header">
                <p className="chat-header-tittle">Mute</p>
                <button onClick={() => chat.setPage("ChatConv")}>return</button>
            </header>
            <section id="mute-menu-section" className="chat-section">
                <form
                    id="form-mute-user"
                    onSubmit={(event) => muteUser(event)}
                    autoComplete="off"
                >
                    <input
                        type="text"
                        id="new-mute-input"
                        onChange={handleNewMuteChange}
                        value={newMute}
                        placeholder="mute username"
                    />
                    <select
                        name="mute-duration"
                        id="mute-duration"
                        onChange={(event) => {
                            handleMuteTimeChange(event);
                        }}
                    >
                        <option value="600">10 minutes</option>
                        <option value="86400">24 hours</option>
                        <option value="604800">7 days</option>
                        <option value="0">no limit</option>
                    </select>
                    <input type="submit" value="mute" />
                </form>
                {currentMutedUsers()}
            </section>
            <footer className="chat-footer"></footer>
        </menu>
    );
};

export default MuteUser;
