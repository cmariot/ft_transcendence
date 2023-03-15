import { ChangeEvent, useContext, useEffect, useState } from "react";
import axios from "axios";
import { ChatContext } from "../../../../contexts/ChatProvider";
import { SocketContext } from "../../../../contexts/SocketProvider";
import { UserContext } from "../../../../contexts/UserProvider";

const EditAdmins = () => {
    const chat = useContext(ChatContext);
    const socket = useContext(SocketContext);
    const user = useContext(UserContext);
    const [newAdminName, setNewAdmin] = useState("");
    const [update, setUpdate] = useState(false);

    // When a admin is removed
    useEffect(() => {
        async function updateAdmins(data: {
            username: string;
            channel: string;
        }) {
            if (chat.channel === data.channel) {
                if (
                    chat.isChannelAdmin === true ||
                    chat.isChannelOwner === true
                ) {
                    let admins = chat.admins;
                    let index = admins.findIndex(
                        (admins) => admins === data.username
                    );
                    if (index !== -1) {
                        admins.splice(index, 1);
                        chat.setAdmins(admins);
                    }
                }
                if (data.username === user.username) {
                    try {
                        const connectResponse = await axios.post(
                            "/api/chat/connect",
                            { channelName: data.channel }
                        );
                        if (connectResponse.status === 201) {
                            chat.setisChannelAdmin(
                                connectResponse.data.channel_admin
                            );
                            chat.setAdmins(connectResponse.data.channel_admins);
                            chat.setmutedUsers(
                                connectResponse.data.muted_users
                            );
                            chat.setbannedUsers(
                                connectResponse.data.banned_users
                            );
                        }
                    } catch (connectResponse: any) {
                        console.log(connectResponse.response.data.message);
                    }
                }
            }
            setUpdate((prevState) => !prevState);
        }
        socket.on("chat.remove.admin", updateAdmins);
        return () => {
            socket.off("chat.remove.admin", updateAdmins);
        };
    }, [chat, socket, user]);

    useEffect(() => {
        setUpdate((prevState) => !prevState);
    }, [chat.admins]);

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
                let admins = chat.admins;
                let index = admins.findIndex((admin) => admin === username);
                if (index !== -1) {
                    admins.splice(index, 1);
                    chat.setAdmins(admins);
                }
                setUpdate((prevState) => !prevState);
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
