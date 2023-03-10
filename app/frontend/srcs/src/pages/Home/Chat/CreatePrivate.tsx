import { ChangeEvent, useContext, useState } from "react";
import axios from "axios";
import { ChatContext } from "../../../contexts/ChatProvider";

const CreatePrivate = () => {
    const chat = useContext(ChatContext);

    const [newChannelName, setNewChannelName] = useState("");

    function handleNewChannelNameChange(event: ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        const { id, value } = event.target;
        if (id === "new-private-name") {
            setNewChannelName(value);
        }
    }

    function cancelCreatePrivate() {
        chat.setPage("YourChannels");
    }

    const submitCreateChannelForm = async (event: any) => {
        event.preventDefault();
        if (newChannelName.length === 0) {
            alert("You must set a name for your new conversation");
            return;
        }
        await axios
            .post("/api/chat/create/private", {
                channelName: newChannelName,
                channelType: "private",
                allowed_users: [chat.directMessageUser],
            })
            .then(function () {
                chat.setChannel(newChannelName);
                chat.setChannelType("private");
                chat.setisChannelOwner(true);
                chat.setMessages([]);
                chat.setAdmins([]);
                chat.setmutedUsers([]);
                chat.setbannedUsers([]);
                chat.closeMenu();
                chat.setPage("ChatConv");
            })
            .catch(function (error) {
                alert(error.response.data.message);
            });
    };

    return (
        <menu id="chat-create-private" className="chat-menu">
            <header className="chat-header">
                <p className="chat-header-tittle">New private chat</p>
                <button onClick={cancelCreatePrivate}>cancel</button>
            </header>
            <section className="chat-section">
                <form
                    onSubmit={(event) => {
                        submitCreateChannelForm(event);
                    }}
                    id="chat-create-private-form"
                    className="chat-main"
                    autoComplete="off"
                >
                    <input
                        id="new-private-name"
                        type="text"
                        placeholder="Channel's name"
                        value={newChannelName}
                        onChange={handleNewChannelNameChange}
                        autoComplete="off"
                        required
                    />
                </form>
                <input type="submit" hidden />
            </section>
            <footer className="chat-footer">
                <input
                    id="submit-create-channel"
                    className="button"
                    type="submit"
                    value="create"
                    onClick={(event) => {
                        submitCreateChannelForm(event);
                    }}
                />
            </footer>
        </menu>
    );
};

export default CreatePrivate;
