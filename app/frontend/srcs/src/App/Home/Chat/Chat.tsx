import { useContext, useEffect, useState } from "react";
import "../../CSS/Chat.css";
import ChatMenu from "./ChatChannels";
import CreateChannelMenu from "./CreateChannelsMenu";
import ChatMessages from "./ChatMessages";
import axios from "axios";
import { Websocketcontext } from "../../../Contexts/WebsocketContext";
import ChatMessage from "./ChatMessage";

const Chat = () => {
    const [currentChannel, changeChannel] = useState("General");
    const [channelMessages, updateChannelMessages] = useState(
        new Array<{ username: string; message: string }>()
    );

    console.log("CHAT COMPONNENT");

    const socket = useContext(Websocketcontext);

    useEffect(() => {
        const listenNewMessage = async () => {
            socket.on("newChatMessage", (socket) => {
                console.log("Event");
                if (socket.channel === currentChannel) {
                    console.log("New message", socket);
                    let newMessage = {
                        username: socket.username,
                        message: socket.message,
                    };
                    updateChannelMessages((state) => [...state, newMessage]);
                }
            });
            socket.on("userChannelConnection", (socket) => {
                if (socket.channel === currentChannel) {
                    console.log(socket.username, "joined your channel.");
                }
            });
        };
        listenNewMessage();
    }, [currentChannel]);

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

        console.log("Clear messages");
        const clearMessages = async () => {
            updateChannelMessages(
                new Array<{ username: string; message: string }>()
            );
        };
        clearMessages();
    }, [currentChannel]);

    let context = {
        currentChannel: currentChannel,
        channelMessages: channelMessages,
    };
    return (
        <>
            <menu id="chat" className="chat-section">
                <header id="chat-header" className="chat-header">
                    <p id="chat-channel">{currentChannel}</p>
                    <button onClick={toogleChatMenu}>change</button>
                </header>
                <main id="chat-main" className="chat-main">
                    <ChatMessages context={context} />
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
