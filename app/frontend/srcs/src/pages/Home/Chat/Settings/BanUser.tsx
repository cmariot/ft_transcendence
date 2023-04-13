import { ChangeEvent, useContext, useEffect, useState } from "react";
import axios from "axios";
import { SocketContext } from "../../../../contexts/sockets/SocketProvider";
import { ChatContext } from "../../../../contexts/chat/ChatContext";
import { UserContext } from "../../../../contexts/user/UserContext";
import { MenuContext } from "../../../../contexts/menu/MenuContext";

const BanUser = () => {
    const chat = useContext(ChatContext);
    const user = useContext(UserContext);
    const socket = useContext(SocketContext);
    const [newBanName, setNewBan] = useState("");
    const [banDuration, setBanDuration] = useState("600"); // default 10 minutes
    const [update, setUpdate] = useState(false);
    const menu = useContext(MenuContext);

    // When an user is banned
    useEffect(() => {
        async function updateBan(data: { channel: string; username: string }) {
            if (data.username === user.username) {
                if (chat.channel === data.channel) {
                    chat.setMessages([]);
                    chat.setChannel("");
                    chat.setChannelType("");
                    chat.setmutedUsers([]);
                    chat.setbannedUsers([]);
                    chat.closeMenu();
                    chat.setPage("YourChannels");
                }
            } else if (chat.channel === data.channel) {
                if (
                    chat.isChannelAdmin === true ||
                    chat.isChannelOwner === true
                ) {
                    let banned = chat.bannedUsers;
                    if (
                        banned.findIndex((ban) => ban === data.username) === -1
                    ) {
                        banned.push(data.username);
                        chat.setbannedUsers(banned);
                    }
                }
                setUpdate((prevState) => !prevState);
            }
        }
        socket.on("chat.user.ban", updateBan);

        return () => {
            socket.off("chat.user.ban", updateBan);
        };
    }, [chat, socket, user]);

    // When an user is unban
    useEffect(() => {
        async function updateBan(data: { channel: string; username: string }) {
            if (chat.channel === data.channel) {
                if (
                    chat.isChannelAdmin === true ||
                    chat.isChannelOwner === true
                ) {
                    let banned = chat.bannedUsers;
                    let index = banned.findIndex(
                        (banned) => banned === data.username
                    );
                    if (index !== -1) {
                        banned.splice(index, 1);
                        chat.setbannedUsers(banned);
                        setUpdate((prevState) => !prevState);
                    }
                }
            }
        }
        socket.on("chat.user.unban", updateBan);
        return () => {
            socket.off("chat.user.unban", updateBan);
        };
    }, [chat, socket, user]);

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
                menu.displayError(error.response.data.message);
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
                menu.displayError(error.response.data.message);
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
