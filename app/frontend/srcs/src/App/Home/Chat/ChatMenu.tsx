import { useContext, useEffect, useState } from "react";
import "../../CSS/Chat.css";
import axios from "axios";
import { Websocketcontext } from "../../../Websockets/WebsocketContext";

const ChatMenu = (props: any) => {
    const [chatChannels, updateChannel] = useState<
        Map<string, { channelType: string }>
    >(new Map<string, { channelType: string }>());

    useEffect(() => {
        const fetchData = async () => {
            axios
                .get("/api/chat/channels")
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
                    updateChannel(initialChannels);
                })
                .catch(function (error) {
                    console.log(error);
                });
        };
        fetchData();
    }, []);

    const socket = useContext(Websocketcontext);

    socket.on("newChannelAvailable", (socket) => {
        const updatedChannels = new Map<string, { channelType: string }>(
            chatChannels
        );
        updatedChannels.set(socket.content.channelName, socket.content);
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
        var chat = document.getElementById("chat");
        var menu = document.getElementById("chat-menu");
        if (chat && menu) {
            menu.style.display = "none";
            chat.style.display = "flex";
        }
    }

    function changeChannel(item: any) {
        console.log("Click on : ", item[0]);
        props.changeChannel(item[0]);
        closeChatMenu();
    }

    return (
        <menu id="chat-menu" className="chat-section">
            <header id="chat-menu-header" className="chat-header">
                <p id="chat-channel">Channels List</p>
                <button onClick={closeChatMenu}>cancel</button>
            </header>
            <div id="chat-menu-channels" className="chat-main">
                {Array.from(chatChannels).map((item, index) => (
                    <button
                        className="chat-menu-li"
                        key={index}
                        onClick={() => changeChannel(item)}
                    >
                        <p className="chat-menu-channel">{item[0]}</p>
                        <p className="chat-menu-channel">
                            ({item[1].channelType})
                        </p>
                    </button>
                ))}
            </div>
            <footer id="chat-menu-buttons" className="chat-footer">
                <button onClick={displayCreateChannel}>new channel</button>
            </footer>
        </menu>
    );
};
export default ChatMenu;
