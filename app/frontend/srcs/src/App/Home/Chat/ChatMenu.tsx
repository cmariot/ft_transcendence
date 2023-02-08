import { useContext, useEffect, useState } from "react";
import "../../CSS/Chat.css";
import axios from "axios";
import { Websocketcontext } from "../../../Websockets/WebsocketContext";

const ChatMenu = () => {
    const [channels, updateChannel] = useState<string[]>([]);
    const socket = useContext(Websocketcontext);

    socket.on("newChannelAvailable", (socket) => {
        updateChannel((previous) => [...previous, socket.content.channelName]);
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

    useEffect(() => {
        axios
            .get("/api/chat/channels")
            .then(function (response) {
                for (let i = 0; i < response.data.length; i++) {
                    if (
                        response.data[i] &&
                        response.data[i].channelName &&
                        channels.find(
                            (element) =>
                                element === response.data[i].channelName
                        ) === undefined
                    ) {
                        const newChannel: string = response.data[i].channelName;
                        updateChannel((previous) => [...previous, newChannel]);
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [channels]);

    return (
        <menu id="chat-menu">
            <ul id="chat-menu-ul">
                {channels.map((item, index) => (
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
