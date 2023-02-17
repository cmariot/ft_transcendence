import { ChangeEvent, useContext, useEffect, useState } from "react";
import "../../CSS/Chat.css";
import axios from "axios";
import { ChatContext } from "./ChatParent";

const EditChannelPassword = () => {
    const chat = useContext(ChatContext);

    const [protectedChannel, setProtectedChannel] = useState(false);
    const [newChannelPassword, setNewChannelPassword] = useState("");

    useEffect(() => {
        if (chat.currentChannelType === "protected") {
            setProtectedChannel(true);
        } else if (chat.currentChannelType === "public") {
            setProtectedChannel(false);
        }
    }, [chat.currentChannelType]);

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
        if (chat.currentChannelType === "protected") {
            setProtectedChannel(true);
        } else if (chat.currentChannelType === "public") {
            setProtectedChannel(false);
        }
        const current = document.getElementById("change-channel-password");
        const menu = document.getElementById("chat-conversation");
        if (menu && current) {
            current.style.display = "none";
            menu.style.display = "flex";
        }
    }

    const submitCreateChannelForm = async (event: any) => {
        event.preventDefault();
        console.log("channel :", chat.currentChannel, chat.currentChannelType);
        console.log("new values :", protectedChannel, newChannelPassword);
        await axios
            .post("/api/chat/updateChannel", {
                channelName: chat.currentChannel,
                channelType: chat.currentChannelType,
                newChannelType: protectedChannel,
                newChannelPassword: newChannelPassword,
            })
            .then(function () {
                if (
                    chat.currentChannel === "protected" &&
                    protectedChannel === false
                ) {
                    chat.changeCurrentChannelType("public");
                } else if (
                    chat.currentChannel === "public" &&
                    protectedChannel === true
                ) {
                    chat.changeCurrentChannelType("protected");
                }
                setNewChannelPassword("");
                const current = document.getElementById(
                    "change-channel-password"
                );
                const menu = document.getElementById("chat-conversation");
                if (menu && current) {
                    current.style.display = "none";
                    menu.style.display = "flex";
                }
            })
            .catch(function (error) {
                alert(error.response.data.message);
            });
    };

    function passwordUpdate() {
        if (
            chat.currentChannelType === "public" &&
            protectedChannel === false
        ) {
            return null;
        } else if (
            chat.currentChannelType === "public" &&
            protectedChannel === true
        ) {
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
            chat.currentChannelType === "protected" &&
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
                <button onClick={cancelCreateChannel}>cancel</button>
            </header>
            <section className="chat-section">
                <form id="chat-create-channel-form" className="chat-main">
                    <label>
                        Password required
                        <input
                            id="new-channel-password-required"
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
                    onClick={submitCreateChannelForm}
                />
            </footer>
        </menu>
    );
};

export default EditChannelPassword;