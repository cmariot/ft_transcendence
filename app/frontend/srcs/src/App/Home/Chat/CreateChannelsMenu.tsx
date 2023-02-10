import { ChangeEvent, useState } from "react";
import "../../CSS/Chat.css";
import axios from "axios";

const CreateChannelMenu = (props: any) => {
    enum ChannelType {
        PRIVATE = "private",
        PUBLIC = "public",
        PROTECTED = "protected",
    }

    const [newChannelName, setNewChannelName] = useState("");
    const [protectedChannel, setProtectedChannel] = useState(false);
    const [newChannelPassword, setNewChannelPassword] = useState("");
    const [newChannelType, setNewChannelType] = useState(ChannelType.PUBLIC);

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
            setNewChannelType(ChannelType.PROTECTED);
        } else {
            if (channelPassordInput) {
                channelPassordInput.style.display = "none";
            }
            setNewChannelType(ChannelType.PUBLIC);
        }
    }

    function closeCreateChannelMenu() {
        const menu = document.getElementById("chat-menu");
        const createChannel = document.getElementById("chat-create-channel");
        if (menu && createChannel) {
            menu.style.display = "flex";
            createChannel.style.display = "none";
        }
    }

    function getBackendUrl(): string {
        if (newChannelType === ChannelType.PUBLIC) {
            return "/api/chat/create/public";
        } else if (newChannelType === ChannelType.PROTECTED) {
            return "/api/chat/create/protected";
        } else if (newChannelType === ChannelType.PRIVATE) {
            return "/api/chat/create/private";
        }
        return "";
    }

    const submitCreateChannelForm = async (event: any) => {
        event.preventDefault();
        const url: string = getBackendUrl();
        if (url === "") return;
        await axios
            .post(url, {
                channelName: newChannelName,
                channelType: newChannelType,
                channelPassword: newChannelPassword,
            })
            .then(function () {
                setNewChannelName("");
                setNewChannelPassword("");
                setProtectedChannel(false);
                const channelPassordInput = document.getElementById(
                    "new-channel-password"
                );
                if (channelPassordInput) {
                    channelPassordInput.style.display = "none";
                }
                closeCreateChannelMenu();
            })
            .catch(function (error) {
                alert(error.response.data.message);
            });
    };

    return (
        <menu id="chat-create-channel" className="chat-section">
            <header className="chat-header">
                <p>New Channel</p>
                <button onClick={closeCreateChannelMenu}>cancel</button>
            </header>
            <form id="chat-create-channel-form" className="chat-main">
                <h4>Create a new channel</h4>
                <input
                    id="new-channel-name"
                    type="text"
                    placeholder="Channel's name"
                    value={newChannelName}
                    onChange={(event) => handleNewChannelNameChange(event)}
                    autoComplete="off"
                    required
                />
                <input
                    id="new-channel-password"
                    type="password"
                    placeholder="Channel's password"
                    value={newChannelPassword}
                    onChange={(event) => handleNewChannelPasswordChange(event)}
                    autoComplete="off"
                />
                <label>
                    Require a password
                    <input
                        id="chat-password-channel-required"
                        type="checkbox"
                        checked={protectedChannel}
                        onChange={handleNewChannelTypeChange}
                    />
                </label>
            </form>
            <div id="chat-create-button" className="chat-footer">
                <input
                    id="submit"
                    className="button"
                    type="submit"
                    value="Create Channel"
                    onClick={(e) => submitCreateChannelForm(e)}
                />
            </div>
        </menu>
    );
};
export default CreateChannelMenu;
