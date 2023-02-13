import { ChangeEvent, useContext, useEffect, useState } from "react";
import "../../CSS/Chat.css";
import axios from "axios";
import { ChatContext } from "./ChatParent";
import { socket } from "../../../Contexts/WebsocketContext";

const CreateChannelMenu = () => {
    enum ChannelType {
        PRIVATE = "private",
        PUBLIC = "public",
        PROTECTED = "protected",
    }

    const chat = useContext(ChatContext);
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
        if (newChannelName.length === 0) {
            alert("You must set a name for your new channel");
            return;
        }
        const url: string = getBackendUrl();
        if (url === "") return;
        await axios
            .post(url, {
                channelName: newChannelName,
                channelType: newChannelType,
                channelPassword: newChannelPassword,
            })
            .then(function () {
                const updatedChannels = new Map<
                    string,
                    { channelType: string }
                >(chat.availableChannels);
                updatedChannels.set(newChannelName, {
                    channelType: newChannelType,
                });
                chat.updateAvailableChannels(updatedChannels);
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
                setNewChannelType(ChannelType.PUBLIC);
                closeCreateChannelMenu();
                const chatChannels =
                    document.getElementById("chat-menu-channels");
                if (chatChannels) {
                    chatChannels.scrollTo(0, chatChannels.scrollHeight);
                }
            })
            .catch(function (error) {
                alert(error.response.data.message);
            });
    };

    useEffect(() => {
        socket.on("newChannelAvailable", (socket) => {
            let updatedChannels = new Map<string, { channelType: string }>(
                chat.availableChannels
            );
            updatedChannels.set(socket.content.channelName, {
                channelType: socket.content.channelType,
            });
            chat.updateAvailableChannels(updatedChannels);
        });
    }, [chat]);

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
                    onClick={submitCreateChannelForm}
                />
            </div>
        </menu>
    );
};
export default CreateChannelMenu;
