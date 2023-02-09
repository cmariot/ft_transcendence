import { useContext, useEffect, useState } from "react";
import "../../CSS/Chat.css";
import axios from "axios";
import { Websocketcontext } from "../../../Websockets/WebsocketContext";

const ChatMenu = () => {
    const [channels, updateChannel] = useState<Set<string>>(fetchChannels());
    const socket = useContext(Websocketcontext);

    function fetchChannels(): Set<string> {
        let initialChannels = new Set<string>();
        axios
            .get("/api/chat/channels")
            .then(function (response) {
                for (let i = 0; i < response.data.length; i++) {
                    if (response.data[i] && response.data[i].channelName) {
                        initialChannels.add(response.data[i].channelName);
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
                return initialChannels;
            });
        return initialChannels;
    }

    socket.on("newChannelAvailable", (socket) => {
        const updatedChannels = new Set(channels);
        if (updatedChannels.has(socket.content.channelName) === false) {
            updatedChannels.add(socket.content.channelName);
        }
        updateChannel(updatedChannels);
    });

    function displayCreateChannel() {
        const menu = document.getElementById("chat-menu");
        const createChannel = document.getElementById("chat-create-channel");
        if (menu && createChannel) {
            menu.style.display = "none";
            createChannel.style.display = "flex";
        }
    }

    function closeChatMenu() {
        var menu = document.getElementById("chat-menu");
        var app = document.getElementById("chat-main");
        var footer = document.getElementById("chat-footer");
        if (app && menu && footer) {
            app.style.display = "flex";
            menu.style.display = "none";
            footer.style.display = "flex";
        }
    }

    useEffect(() => {}, []);

    return (
        <menu id="chat-menu">
            <ul id="chat-menu-ul">
                {Array.from(channels).map((item, index) => (
                    <li className="chat-menu-li" key={index}>
                        <p className="chat-menu-channel">{item}</p>
                    </li>
                ))}
            </ul>
            <div id="chat-menu-buttons">
                <button onClick={displayCreateChannel}>new channel</button>
                <button onClick={closeChatMenu}>cancel</button>
            </div>
        </menu>
    );
};
export default ChatMenu;
