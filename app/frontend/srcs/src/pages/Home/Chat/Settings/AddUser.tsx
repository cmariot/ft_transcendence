import { ChangeEvent, useContext, useEffect, useState } from "react";
import axios from "axios";
import { SocketContext } from "../../../../contexts/sockets/SocketProvider";
import { ChatContext } from "../../../../contexts/chat/ChatContext";
import { MenuContext } from "../../../../contexts/menu/MenuContext";

const AddUser = () => {
    const chat = useContext(ChatContext);
    const [newUser, setNewUser] = useState("");
    const menu = useContext(MenuContext);
    const [update, setUpdate] = useState(false);

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
                menu.displayError(error.response.data.message);
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
                menu.displayError(error.response.data.message);
            });
    }

    const socket = useContext(SocketContext);

    // When an user leave a private channel
    useEffect(() => {
        async function updateUsers(data: {
            channel: string;
            username: string;
        }) {
            let users = chat.users;
            let index = users.findIndex((muted) => muted === data.username);
            if (index !== -1) {
                users.splice(index, 1);
                chat.setUsers(users);
            }
            setUpdate((prevState) => !prevState);
        }
        socket.on("user.leave.private", updateUsers);
        return () => {
            socket.off("user.leave.private", updateUsers);
        };
    }, [chat, socket]);

    // When an user is added in a private channel
    useEffect(() => {
        async function updateUsers(data: {
            channel: string;
            username: string;
        }) {
            let users = chat.users;
            let index = users.findIndex((user) => user === data.username);
            if (index === -1) {
                users.push(data.username);
                chat.setUsers(users);
            }
            setUpdate((prevState) => !prevState);
        }
        socket.on("user.join.private", updateUsers);
        return () => {
            socket.off("user.join.private", updateUsers);
        };
    }, [chat, socket]);

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
                {chat.users.length > 0 ? (
                    <ul id="channel-users-list">
                        <p>Channel users :</p>
                        {chat.users.map((user, index) => (
                            <li className="admin-channel" key={index}>
                                <p className="admin-channel-username">{user}</p>
                                <button onClick={() => kickUser(user)}>
                                    kick
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>You are alone in this channel.</p>
                )}
            </section>
            <footer className="chat-footer"></footer>
        </menu>
    );
};

export default AddUser;
