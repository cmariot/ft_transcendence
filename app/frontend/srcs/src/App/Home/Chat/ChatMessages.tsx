import { useContext } from "react";
import "../../CSS/Chat.css";
import ChatContext from "../../../Contexts/ChatContext";
import { Websocketcontext } from "../../../Contexts/WebsocketContext";

const ChatMessages = () => {
    const chat = useContext(ChatContext);
    const socket = useContext(Websocketcontext);

    return (
        <ul id="chat-main-ul">
            {chat.currentChannelMessages.map((item: any, index: any) => (
                <li className="chat-main-li" key={index}>
                    <p className="chat-menu-channel">{item.username} : </p>
                    <p className="chat-menu-channel">{item.message}</p>
                </li>
            ))}
        </ul>
    );
};
export default ChatMessages;
