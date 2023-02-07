import { ChangeEvent, useEffect, useState } from "react";
import "../CSS/Chat.css";

const Chat = (props) => {
    const [menu, setMenu] = useState("menu");
    const [message, setMessage] = useState("");

    const handleTyping = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (id === "chat-message-input") {
            setMessage(value);
        }
    };

    function toogleChatMenu() {
        var menu = document.getElementById("chat-menu");
        var app = document.getElementById("chat-main");
        if (menu.style.display == "flex") {
            app.style.display = "flex";
            menu.style.display = "none";
        } else {
            app.style.display = "none";
            menu.style.display = "flex";
        }
    }

    function closeChatMenu() {
        var menu = document.getElementById("chat-menu");
        var app = document.getElementById("chat-main");
        app.style.display = "flex";
        menu.style.display = "none";
    }

    function sendMessage() {
        setMessage("");
    }

    useEffect(() => {
        var chatMessages = document.getElementById("chat-main-ul");
        chatMessages.scrollTo(0, chatMessages.scrollHeight);
    }, []);

    return (
        <div id="chat">
            <header id="chat-header">
                <p id="chat-channel">channel name</p>
                <button onClick={toogleChatMenu}>{menu}</button>
            </header>
            <menu id="chat-menu">
                <button>Join another channel</button>
                <button>Create a channel</button>
                <button>Leave current channel</button>
                <button onClick={closeChatMenu}>Cancel</button>
            </menu>
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
                        <p className="chat-message">message</p>
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
                        <p className="chat-message">message</p>
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
                        <p className="chat-message">message</p>
                    </li>{" "}
                    <li className="chat-main-li">
                        <p className="chat-username">toto :</p>
                        <p className="chat-message">message</p>
                    </li>{" "}
                    <li className="chat-main-li">
                        <p className="chat-username">toto :</p>
                        <p className="chat-message">dernier message</p>
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
