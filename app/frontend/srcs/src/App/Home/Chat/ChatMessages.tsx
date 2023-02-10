import { useContext, useState } from "react";
import "../../CSS/Chat.css";
import { Websocketcontext } from "../../../Websockets/WebsocketContext";

const ChatMessages = (props: any) => {
    const [channelMessages, updateChannelMessages] = useState(
        new Array<{ username: string; message: string }>()
    );

    const socket = useContext(Websocketcontext);

    socket.on("newMessage", (socket) => {
        if (socket.channel === props.channel) {
            let newMessage = {
                username: socket.username,
                message: socket.message,
            };
            updateChannelMessages((state) => [...state, newMessage]);
        }
    });

    return (
        <>
            <ul id="chat-main-ul">
                {channelMessages.map((item, index) => (
                    <li className="chat-main-li" key={index}>
                        <p className="chat-menu-channel">{item.username} : </p>
                        <p className="chat-menu-channel">{item.message}</p>
                    </li>
                ))}
            </ul>
        </>
    );
};
export default ChatMessages;
