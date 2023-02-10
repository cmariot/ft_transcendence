import { useContext, useEffect, useState } from "react";
import "../../CSS/Chat.css";
import ChatMenu from "./ChatMenu";
import CreateChannelMenu from "./CreateChannelsMenu";
import ChatMessages from "./ChatMessages";
import axios from "axios";
import { Websocketcontext } from "../../../Websockets/WebsocketContext";
import ChatMessage from "./ChatMessage";

const Chat = () => {
    const [currentChannel, changeChannel] = useState("General");

    const socket = useContext(Websocketcontext);

    socket.on("userChannelConnection", (socket) => {
        if (socket.channel === currentChannel) {
            console.log(socket.username, "joined your channel.");
        }
    });

    function toogleChatMenu() {
        var chat = document.getElementById("chat");
        var menu = document.getElementById("chat-menu");
        if (chat && menu) {
            if (chat.style.display === "flex") {
                chat.style.display = "none";
                menu.style.display = "flex";
            } else {
                menu.style.display = "flex";
                chat.style.display = "none";
            }
        }
    }

    useEffect(() => {
        // Send an alert : Join channel
        axios
            .post("/api/chat/connect", { channelName: currentChannel })
            .catch(function (error) {
                console.log(error);
            });

        // Go to the bottom of the chat
        var chatMessages = document.getElementById("chat-main-ul");
        if (chatMessages) chatMessages.scrollTo(0, chatMessages.scrollHeight);
    }, [currentChannel]);

    return (
        <>
            <menu id="chat" className="chat-section">
                <header id="chat-header" className="chat-header">
                    <p id="chat-channel">{currentChannel}</p>
                    <button onClick={toogleChatMenu}>change</button>
                </header>
                <main id="chat-main" className="chat-main">
                    <ChatMessages channel={currentChannel} />
                </main>
                <footer id="chat-footer" className="chat-footer">
                    <ChatMessage channel={currentChannel} />
                </footer>
            </menu>
            <ChatMenu changeChannel={changeChannel} />
            <CreateChannelMenu />
        </>
    );
};
export default Chat;
