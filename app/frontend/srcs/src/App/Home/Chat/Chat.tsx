import { useContext } from "react";
import "../../CSS/Chat.css";
import ChatMenu from "./ChatChannels";
import CreateChannelMenu from "./CreateChannelsMenu";
import ChatMessages from "./ChatMessages";
import { Websocketcontext } from "../../../Contexts/WebsocketContext";
import ChatMessage from "./ChatMessage";
import ChatContext from "../../../Contexts/ChatContext";

const Chat = () => {
    const chat = useContext(ChatContext);
    const socket = useContext(Websocketcontext);

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

    return (
        <>
            <menu id="chat" className="chat-section">
                <header id="chat-header" className="chat-header">
                    <p id="chat-channel">{chat.currentChannel}</p>
                    <button onClick={toogleChatMenu}>change</button>
                </header>
                <main id="chat-main" className="chat-main">
                    <ChatMessages />
                </main>
                <footer id="chat-footer" className="chat-footer">
                    <ChatMessage />
                </footer>
            </menu>
            <ChatMenu />
            <CreateChannelMenu />
        </>
    );
};

export default Chat;

//const [channelMessages, updateChannelMessages] = useState(
//    new Array<{ username: string; message: string }>()
//);

//useEffect(() => {
// Send an alert : Join channel
//axios
//    .post("/api/chat/connect", { channelName: chat.currentChannel })
//    .catch(function (error) {
//        console.log(error);
//    });
// Go to the bottom of the chat
//var chatMessages = document.getElementById("chat-main-ul");
//if (chatMessages) chatMessages.scrollTo(0, chatMessages.scrollHeight);
//const clearMessages = async () => {
//    updateChannelMessages(
//        new Array<{ username: string; message: string }>()
//    );
//};
//clearMessages();
//}, [chat.currentChannel]);
