import { ChangeEvent, useContext, useState } from "react";
import "../../CSS/Chat.css";
import axios from "axios";
import { ChatContext } from "./ChatParent";

const CreateChannel = () => {
    const chat = useContext(ChatContext);

    const [newChannelName, setNewChannelName] = useState("");
    const [protectedChannel, setProtectedChannel] = useState(false);
    const [newChannelPassword, setNewChannelPassword] = useState("");

    function handleNewChannelNameChange(event: ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        const { id, value } = event.target;
        if (id === "new-channel-name") {
            setNewChannelName(value);
        }
    }

    function handleNewChannelPasswordChange(
        event: ChangeEvent<HTMLInputElement>
    ) {
        event.preventDefault();
        const { id, value } = event.target;
        if (id === "new-channel-password") {
            setNewChannelPassword(value);
        }
    }

    function handleNewChannelTypeChange() {
        setNewChannelPassword("");
        const newValue: boolean = !protectedChannel;
        setProtectedChannel(newValue);
        const channelPassordInput = document.getElementById(
            "new-channel-password"
        );
        if (newValue === true) {
            if (channelPassordInput) {
                channelPassordInput.style.display = "inline";
            }
        } else {
            if (channelPassordInput) {
                channelPassordInput.style.display = "none";
            }
        }
    }

    function cancelCreateChannel() {
        const current = document.getElementById("chat-create-channel");
        const menu = document.getElementById("chat-channels-list");
        if (menu && current) {
            current.style.display = "none";
            menu.style.display = "flex";
        }
    }

    function getBackendUrl(): string {
        if (protectedChannel === false) {
            return "/api/chat/create/public";
        } else {
            return "/api/chat/create/protected";
        }
    }

    const submitCreateChannelForm = async (event: any) => {
        event.preventDefault();
        if (newChannelName.length === 0) {
            alert("You must set a name for your new channel");
            return;
        }
        const url: string = getBackendUrl();
        if (url === "") return;
        let newChannelType: string;
        if (protectedChannel === true) {
            newChannelType = "protected";
        } else {
            newChannelType = "public";
        }
        await axios
            .post(url, {
                channelName: newChannelName,
                channelType: newChannelType,
                channelPassword: newChannelPassword,
            })
            .then(function () {
                const updatedUserChannels = new Map<
                    string,
                    { channelType: string }
                >(chat.userChannels);
                updatedUserChannels.set(newChannelName, {
                    channelType: newChannelType,
                });
                chat.updateUserChannels(updatedUserChannels);
                chat.setCurrentChannelMessages([]);
                chat.changeCurrentChannel(newChannelName);
                chat.changeCurrentChannelType(newChannelType);
                chat.setChannelOwner(true);
                chat.setCurrentChannelAdmins([]);
                chat.setCurrentChannelMute([]);
                chat.setCurrentChannelBan([]);
                const current = document.getElementById("chat-create-channel");
                const menu = document.getElementById("chat-conversation");
                if (menu && current) {
                    current.style.display = "none";
                    menu.style.display = "flex";
                }
                if (protectedChannel) {
                    const channelPasswordInput = document.getElementById(
                        "new-channel-password"
                    );
                    if (channelPasswordInput) {
                        channelPasswordInput.style.display = "none";
                    }
                }
                setNewChannelName("");
                setNewChannelPassword("");
                setProtectedChannel(false);
            })
            .catch(function (error) {
                alert(error.response.data.message);
            });
    };

    return (
        <menu id="chat-create-channel" className="chat-menu">
            <header className="chat-header">
                <p className="chat-header-tittle">New channel</p>
                <button onClick={cancelCreateChannel}>cancel</button>
            </header>
            <section className="chat-section">
                <form id="chat-edit-password-form" className="chat-main">
                    <input
                        id="new-channel-name"
                        type="text"
                        placeholder="Channel's name"
                        value={newChannelName}
                        onChange={handleNewChannelNameChange}
                        autoComplete="off"
                        required
                    />
                    <input
                        id="new-channel-password"
                        type="password"
                        placeholder="Channel's password"
                        value={newChannelPassword}
                        onChange={handleNewChannelPasswordChange}
                        autoComplete="off"
                    />
                    <label>
                        Require a password
                        <input
                            id="new-channel-password-required"
                            type="checkbox"
                            checked={protectedChannel}
                            onChange={handleNewChannelTypeChange}
                        />
                    </label>
                </form>
            </section>
            <footer className="chat-footer">
                <input
                    id="submit-create-channel"
                    className="button"
                    type="submit"
                    value="create"
                    onClick={submitCreateChannelForm}
                />
            </footer>
        </menu>
    );
};

export default CreateChannel;
