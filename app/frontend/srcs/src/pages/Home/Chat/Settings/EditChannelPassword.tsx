import { ChangeEvent, useContext, useEffect, useState } from "react";
import axios from "axios";
import { ChatContext } from "../../../../contexts/chat/ChatContext";
import { MenuContext } from "../../../../contexts/menu/MenuContext";

const EditChannelPassword = () => {
    const chat = useContext(ChatContext);
    const menu = useContext(MenuContext);

    const [protectedChannel, setProtectedChannel] = useState(false);
    const [newChannelPassword, setNewChannelPassword] = useState("");

    useEffect(() => {
        if (chat.channelType === "protected") {
            setProtectedChannel(true);
        } else if (chat.channelType === "public") {
            setProtectedChannel(false);
        }
    }, [chat.channelType]);

    function handleNewChannelPasswordChange(
        event: ChangeEvent<HTMLInputElement>
    ) {
        event.preventDefault();
        const { id, value } = event.target;
        if (id === "new-password" || id === "password-update") {
            setNewChannelPassword(value);
        }
    }

    function handleNewChannelTypeChange() {
        setNewChannelPassword("");
        setProtectedChannel((prevState) => !prevState);
    }

    function cancelEdit() {
        if (chat.channelType === "protected") {
            setProtectedChannel(true);
        } else if (chat.channelType === "public") {
            setProtectedChannel(false);
        }
        chat.setPage("ChatConv");
    }

    const submitChannelEdit = async (event: any) => {
        event.preventDefault();
        await axios
            .post("/api/chat/updateChannel", {
                channelName: chat.channel,
                channelType: chat.channelType,
                newChannelType: protectedChannel,
                newChannelPassword: newChannelPassword,
            })
            .then(function () {
                if (
                    chat.channel === "protected" &&
                    protectedChannel === false
                ) {
                    chat.setChannelType("public");
                } else if (
                    chat.channel === "public" &&
                    protectedChannel === true
                ) {
                    chat.setChannelType("protected");
                }
                setNewChannelPassword("");
                chat.setPage("ChatConv");
            })
            .catch(function (error) {
                menu.displayError(error.response.data.message);
            });
    };

    function passwordUpdate() {
        if (chat.channelType === "public" && protectedChannel === false) {
            return null;
        } else if (chat.channelType === "public" && protectedChannel === true) {
            return (
                <input
                    id="new-password"
                    type="password"
                    placeholder="new password"
                    value={newChannelPassword}
                    onChange={handleNewChannelPasswordChange}
                    autoComplete="off"
                />
            );
        } else if (
            chat.channelType === "protected" &&
            protectedChannel === false
        ) {
            return null;
        } else {
            return (
                <input
                    id="password-update"
                    type="password"
                    placeholder="Update channel's password"
                    value={newChannelPassword}
                    onChange={handleNewChannelPasswordChange}
                    autoComplete="off"
                />
            );
        }
    }

    return (
        <menu id="change-channel-password" className="chat-menu">
            <header className="chat-header">
                <p className="chat-header-tittle">Edit channel password</p>
                <button onClick={cancelEdit}>cancel</button>
            </header>
            <section className="chat-section">
                <form
                    onSubmit={(event) => {
                        submitChannelEdit(event);
                    }}
                    id="chat-create-channel-form"
                    className="chat-main"
                    autoComplete="off"
                >
                    <label>
                        Password required
                        <input
                            id="require-channel-password"
                            type="checkbox"
                            checked={protectedChannel}
                            onChange={handleNewChannelTypeChange}
                        />
                    </label>
                    {passwordUpdate()}
                </form>
            </section>
            <footer className="chat-footer">
                <input
                    id="submit-create-channel"
                    className="button"
                    type="submit"
                    value="update"
                    onClick={(event) => submitChannelEdit(event)}
                />
            </footer>
        </menu>
    );
};

export default EditChannelPassword;
