import { ChangeEvent, useContext, useState } from "react";
import "../../CSS/Chat.css";
import axios from "axios";
import { ChatContext } from "./ChatParent";

const CreateChannel = () => {
    const chat = useContext(ChatContext);

    const [channelName, setChannelName] = useState("");
    const [channelType, setChannelType] = useState("public");
    const [channelPassword, setNewChannelPassword] = useState("");

    function cancelCreateChannel() {
        const current = document.getElementById("chat-create-channel");
        const menu = document.getElementById("chat-channels-list");
        if (menu && current) {
            current.style.display = "none";
            menu.style.display = "flex";
        }
    }

    function handleTypeChange(event: any) {
        event.preventDefault();
        const { id, value } = event.target;
        if (id === "channel-type-select") {
            setChannelType(value);
        }
    }

    function passwordIfProtected() {
        if (channelType === "protected") {
            return (
                <input
                    id="new-channel-password"
                    type="password"
                    placeholder="Channel's password"
                    value={channelPassword}
                    onChange={handleNewChannelPasswordChange}
                />
            );
        }
    }

    function handleNewChannelNameChange(event: ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        const { id, value } = event.target;
        if (id === "new-channel-name") {
            setChannelName(value);
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

    const submitCreateChannelForm = (event: any) => {
        event.preventDefault();
        let url: string;
        if (channelType === "public") {
            url = "/api/chat/create/public";
        } else if (channelType === "protected") {
            url = "/api/chat/create/protected";
        } else if (channelType === "privateChannel") {
            url = "/api/chat/create/privatechannel";
        } else {
            return;
        }
        axios
            .post(url, {
                channelName: channelName,
                channelType: channelType,
                channelPassword: channelPassword,
            })
            .then(function () {
                const updatedUserChannels = new Map<
                    string,
                    { channelType: string }
                >(chat.userChannels);
                updatedUserChannels.set(channelName, {
                    channelType: channelType,
                });
                chat.updateUserChannels(updatedUserChannels);
                chat.setCurrentChannelMessages([]);
                chat.changeCurrentChannel(channelName);
                chat.changeCurrentChannelType(channelType);
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
                setChannelName("");
                setNewChannelPassword("");
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
                <form
                    onSubmit={submitCreateChannelForm}
                    id="chat-edit-password-form"
                    autoComplete="off"
                    className="chat-main"
                >
                    <select
                        name="channel-type"
                        id="channel-type-select"
                        onChange={(event) => handleTypeChange(event)}
                    >
                        <option value="public">public</option>
                        <option value="protected">protected</option>
                        <option value="privateChannel">private</option>
                    </select>
                    <input
                        id="new-channel-name"
                        type="text"
                        placeholder="Channel's name"
                        value={channelName}
                        onChange={handleNewChannelNameChange}
                        required
                    />
                    {passwordIfProtected()}
                    <input type="submit" hidden />
                </form>
            </section>
            <footer className="chat-footer">
                <button
                    type="submit"
                    id="submit-create-channel"
                    className="button"
                    value="create"
                    onClick={submitCreateChannelForm}
                >
                    create
                </button>
            </footer>
        </menu>
    );
};

export default CreateChannel;
