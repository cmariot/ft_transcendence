import { useContext, useEffect, useState } from "react";
import "../../CSS/Chat.css";
import axios from "axios";
import { Websocketcontext } from "../../../Websockets/WebsocketContext";

const ChatMenu = () => {
    const [chatChannels, setChatChannels] = useState([]);

    const socket = useContext(Websocketcontext);
    function displayCreateChannel() {
        const menu = document.getElementById("chat-menu");
        const createChannel = document.getElementById("chat-create-channel");
        if (menu && createChannel) {
            menu.style.display = "none";
            createChannel.style.display = "flex";
        }
    }

    function getInitialChannelsList() {
        axios
            .get("/api/chat/channels")
            .then(function (response) {
                for (let i = 0; i < response.data.length; i++) {
                    if (
                        response.data[i] &&
                        chatChannels.find(
                            (element) =>
                                element === response.data[i].channelName
                        ) === undefined
                    ) {
                        const newChannel: string = response.data[i].channelName;
                        chatChannels.push(newChannel);
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function closeChatMenu() {
        var menu = document.getElementById("chat-menu");
        var app = document.getElementById("chat-main");
        if (app && menu) {
            app.style.display = "flex";
            menu.style.display = "none";
        }
    }

    useEffect(() => {
        console.log("USEEFFECT");
        // Get the initial channels list
        getInitialChannelsList();

        socket.on("newChannelAvailable", (socket) => {
            console.log("NEW CHANNEL = ", socket.content.channelName);
        });
    });

    return (
        <menu id="chat-menu">
            <h3>Channels list :</h3>
            <ul>
                {chatChannels.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
            <button onClick={displayCreateChannel}>Create a channel</button>
            <button onClick={closeChatMenu}>Cancel</button>
        </menu>
    );
};
export default ChatMenu;
