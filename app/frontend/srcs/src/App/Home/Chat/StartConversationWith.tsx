import { useContext, useEffect, useState } from "react";
import "../../CSS/Chat.css";
import axios from "axios";
import { ChatContext } from "./ChatParent";

const StartConversationWith = () => {
    const chat = useContext(ChatContext);
    const [conversations, setConversations] = useState(
        new Map<string, { channelType: string }>()
    );

    const [newConversationlName, setNewConversationName] = useState("");
    const [displayCreate, setDisplayCreate] = useState(false);

    function closeStartConvMenu() {
        var chatMenu = document.getElementById("chat");
        var menu = document.getElementById("conversation-with-menu");
        if (chatMenu && menu) {
            menu.style.display = "none";
            chatMenu.style.display = "flex";
        }
        if (displayCreate === true) {
            setDisplayCreate(false);
        }
    }

    async function joinChannel(channel: string) {
        await axios
            .post("/api/chat/connect", { channelName: channel })
            .then(function (response) {
                chat.setCurrentChannelMessages([]);
                chat.changeCurrentChannel(channel);
                chat.setCurrentChannelMessages(response.data);
                closeStartConvMenu();
            })
            .catch(function (error) {
                if (
                    error.response &&
                    error.response.data &&
                    error.response.data.statusCode &&
                    error.response.data.message &&
                    error.response.data.statusCode === 302 &&
                    error.response.data.message ===
                        "Enter the channel's password"
                ) {
                    var passwordMenu = document.getElementById(
                        "chat-join-protected"
                    );
                    var menu = document.getElementById("chat-menu");
                    if (passwordMenu && menu) {
                        menu.style.display = "none";
                        passwordMenu.style.display = "flex";
                    }
                }
            });
    }

    useEffect(() => {
        if (chat.conversationUser.length > 0) {
            axios
                .post("/api/chat/conversations", {
                    username: chat.conversationUser,
                })
                .then(function (response) {
                    let initialChannels = new Map<
                        string,
                        { channelType: string }
                    >();
                    for (let i = 0; i < response.data.length; i++) {
                        if (response.data[i] && response.data[i].channelName) {
                            initialChannels.set(
                                response.data[i].channelName,
                                response.data[i]
                            );
                        }
                    }
                    setConversations(initialChannels);
                })
                .catch(function (error) {
                    console.log(error.response);
                });
        }
    }, [chat.conversationUser]);

    function handleNewConversationNameChange(event: any) {
        event.preventDefault();
        const { id, value } = event.target;
        if (id === "new-conversation-name") {
            setNewConversationName(value);
        }
    }

    function toggleDisplayCreate() {
        setDisplayCreate(!displayCreate);
    }

    const submitCreateConversationForm = async (event: any) => {
        event.preventDefault();
        if (newConversationlName.length === 0) {
            alert("You must set a name for your new conversation");
            return;
        }
        await axios
            .post("/api/chat/create/private", {
                channelName: newConversationlName,
                channelType: "private",
                allowed_users: [chat.conversationUser],
            })
            .then(async function () {
                await axios
                    .post("/api/chat/connect", {
                        channelName: newConversationlName,
                    })
                    .then(function (response) {
                        chat.setCurrentChannelMessages(response.data);
                        chat.changeCurrentChannel(newConversationlName);
                        closeStartConvMenu();
                    })
                    .catch(function (error) {
                        alert(error.response.data.message);
                    });
            })
            .catch(function (error) {
                alert(error.response.data.message);
            });
    };

    function availableChannels() {
        if (conversations.size > 0 && displayCreate === false) {
            return (
                <menu id="conversation-with-menu" className="chat-section">
                    <header id="chat-menu-header" className="chat-header">
                        <p id="chat-channel">
                            Your private chat with {chat.conversationUser} list
                        </p>
                        <button onClick={closeStartConvMenu}>cancel</button>
                    </header>
                    <div id="chat-menu-channels" className="chat-main">
                        {Array.from(conversations).map((item, index) => (
                            <button
                                className="chat-menu-li"
                                key={index}
                                onClick={() => joinChannel(item[0])}
                            >
                                <p className="chat-menu-channel">{item[0]}</p>
                                <p className="chat-menu-channel">
                                    ({item[1].channelType})
                                </p>
                            </button>
                        ))}
                    </div>
                    <footer id="chat-menu-buttons" className="chat-footer">
                        <button onClick={() => toggleDisplayCreate()}>
                            new
                        </button>
                    </footer>
                </menu>
            );
        } else {
            return (
                <menu id="conversation-with-menu" className="chat-section">
                    <header id="chat-menu-header" className="chat-header">
                        <p id="chat-channel">
                            Start a conversation with {chat.conversationUser}
                        </p>
                        <button onClick={closeStartConvMenu}>cancel</button>
                    </header>
                    <div
                        id="chat-menu-channels"
                        className="chat-main conversation-with-create"
                    >
                        <p>Name your conversation</p>
                        <input
                            id="new-conversation-name"
                            type="text"
                            placeholder="Conversation's name"
                            value={newConversationlName}
                            onChange={handleNewConversationNameChange}
                            autoComplete="off"
                            required
                        />
                    </div>
                    <footer id="chat-menu-buttons" className="chat-footer">
                        <input
                            id="submit"
                            className="button"
                            type="submit"
                            value="Start Chatting"
                            onClick={submitCreateConversationForm}
                        />
                    </footer>
                </menu>
            );
        }
    }
    return availableChannels();
};
export default StartConversationWith;
