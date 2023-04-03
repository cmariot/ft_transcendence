import { ChangeEvent, useContext, useState } from "react";
import axios from "axios";
import { ChatContext } from "../../../contexts/chat/ChatContext";
import { MenuContext } from "../../../contexts/menu/MenuContext";

const CreateChannel = () => {
    const chat = useContext(ChatContext);
    const [channelName, setChannelName] = useState("");
    const [channelType, setChannelType] = useState("public");
    const [channelPassword, setNewChannelPassword] = useState("");
    const menu = useContext(MenuContext);

    function cancelCreateChannel() {
        chat.setPage("YourChannels");
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
                    autoComplete="off"
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
        } else if (channelType === "private") {
            url = "/api/chat/create/private";
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
                if (channelType === "public" || channelType === "protected") {
                    const updatedUserChannels = new Map<
                        string,
                        { channelType: string }
                    >(chat.userChannels);
                    updatedUserChannels.set(channelName, {
                        channelType: channelType,
                    });
                    chat.updateUserChannels(updatedUserChannels);
                } else {
                    const updatedUserPrivateChannels = new Map<
                        string,
                        { channelType: string }
                    >(chat.userPrivateChannels);
                    updatedUserPrivateChannels.set(channelName, {
                        channelType: channelType,
                    });
                    chat.updateUserPrivateChannels(updatedUserPrivateChannels);
                }
                setChannelName("");
                setNewChannelPassword("");
                chat.setMessages([]);
                chat.setChannel(channelName);
                chat.setChannelType(channelType);
                chat.setisChannelOwner(true);
                chat.setAdmins([]);
                chat.setmutedUsers([]);
                chat.setbannedUsers([]);
                chat.setUsers([]);
                chat.setPage("ChatConv");
            })
            .catch(function (error) {
                menu.displayError(error.response.data.message);
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
                    <label>Channel type :</label>
                    <select
                        name="channel-type"
                        id="channel-type-select"
                        onChange={(event) => handleTypeChange(event)}
                    >
                        <option value="public">public</option>
                        <option value="protected">protected</option>
                        <option value="private">private</option>
                    </select>
                    <input
                        id="new-channel-name"
                        type="text"
                        placeholder="Channel's name"
                        value={channelName}
                        onChange={handleNewChannelNameChange}
                        autoComplete="off"
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
