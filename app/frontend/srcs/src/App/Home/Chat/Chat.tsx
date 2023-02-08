import { ChangeEvent, useContext, useEffect, useState } from "react";
import "../../CSS/Chat.css";
import { Websocketcontext } from "../../../Websockets/WebsocketContext";
import axios from "axios";
import ChatMenu from "./ChatMenu";

const Chat = (props: any) => {
    const [message, setMessage] = useState("");
    const [newChannelName, setNewChannelName] = useState("");

    const handleTyping = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const { id, value } = e.target;
        if (id === "chat-message-input") {
            setMessage(value);
        }
    };

    function toogleChatMenu() {
        var menu = document.getElementById("chat-menu");
        var app = document.getElementById("chat-main");
        var createChatChannel = document.getElementById("chat-create-channel");
        if (createChatChannel) {
            createChatChannel.style.display = "none";
        }
        if (menu && app) {
            if (menu.style.display === "flex") {
                app.style.display = "flex";
                menu.style.display = "none";
            } else {
                app.style.display = "none";
                menu.style.display = "flex";
            }
        }
    }

    function displayCreateChannel() {
        const menu = document.getElementById("chat-menu");
        const createChannel = document.getElementById("chat-create-channel");
        if (menu && createChannel) {
            menu.style.display = "none";
            createChannel.style.display = "flex";
        }
    }

    function handleNewChannelNameChange(event: ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        const { id, value } = event.target;
        if (id === "new-channel-name") {
            setNewChannelName(value);
        }
    }

    const submitCreateChannelForm = async (event: any) => {
        event.preventDefault();
        await axios
            .post("/api/chat/create-channel", {
                channelName: newChannelName,
            })
            .then(function () {
                setNewChannelName("");
            })
            .catch(function (error) {
                alert(error.response.data.message);
            });
    };

    function closeChatMenu() {
        var menu = document.getElementById("chat-menu");
        var app = document.getElementById("chat-main");
        if (app && menu) {
            app.style.display = "flex";
            menu.style.display = "none";
        }
    }

    function sendMessage() {
        setMessage("");
    }

    useEffect(() => {
        // Go to the bottom of the chat
        var chatMessages = document.getElementById("chat-main-ul");
        if (chatMessages) chatMessages.scrollTo(0, chatMessages.scrollHeight);
    });

    return (
        <div id="chat">
            <>
                <header id="chat-header">
                    <p id="chat-channel">channel name</p>
                    <button onClick={toogleChatMenu}>menu</button>
                </header>
            </>
            <ChatMenu />
            <>
                <menu id="chat-create-channel">
                    <form>
                        <input
                            id="new-channel-name"
                            type="text"
                            placeholder="New Channel"
                            value={newChannelName}
                            onChange={(event) =>
                                handleNewChannelNameChange(event)
                            }
                            autoComplete="off"
                            required
                        />
                        <input
                            id="submit"
                            className="button"
                            type="submit"
                            value="Create Channel"
                            onClick={(e) => submitCreateChannelForm(e)}
                        />
                    </form>
                </menu>
            </>
            <main id="chat-main">
                <ul id="chat-main-ul">
                    <li className="chat-main-li">
                        <p className="chat-username">toto :</p>
                        <p className="chat-message">premier message</p>
                    </li>{" "}
                    <li className="chat-main-li">
                        <p className="chat-username">toto :</p>
                        <p className="chat-message">message</p>
                    </li>{" "}
                    <li className="chat-main-li">
                        <p className="chat-username">toto :</p>
                        <p className="chat-message">message</p>
                    </li>
                    <li className="chat-main-li">
                        <p className="chat-username">toto :</p>
                        <p className="chat-message">premier message</p>
                    </li>{" "}
                    <li className="chat-main-li">
                        <p className="chat-username">toto :</p>
                        <p className="chat-message">message</p>
                    </li>{" "}
                    <li className="chat-main-li">
                        <p className="chat-username">toto :</p>
                        <p className="chat-message">message</p>
                    </li>{" "}
                    <li className="chat-main-li">
                        <p className="chat-username">toto :</p>
                        <p className="chat-message">premier message</p>
                    </li>{" "}
                    <li className="chat-main-li">
                        <p className="chat-username">toto :</p>
                        <p className="chat-message">message</p>
                    </li>{" "}
                    <li className="chat-main-li">
                        <p className="chat-username">toto :</p>
                        <p className="chat-message">message</p>
                    </li>
                </ul>
            </main>
            <footer id="chat-footer">
                <input
                    id="chat-message-input"
                    type="text"
                    placeholder="message"
                    value={message}
                    onChange={handleTyping}
                />
                <input type="submit" value="send" onClick={sendMessage} />
            </footer>
        </div>
    );
};
export default Chat;
