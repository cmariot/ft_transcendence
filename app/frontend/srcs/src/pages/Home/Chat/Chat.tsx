import { useContext } from "react";
import YourChannels from "./YourChannels";
import ChannelsList from "./ChannelsList";
import CreateChannel from "./CreateChannel";
import ChatConv from "./ChatConv";
import JoinProtected from "./JoinProtected";
import CreatePrivate from "./CreatePrivate";
import EditChannelPassword from "./Settings/EditChannelPassword";
import EditAdmins from "./Settings/EditAdmins";
import BanUser from "./Settings/BanUser";
import MuteUser from "./Settings/MuteUser";
import KickUser from "./Settings/KickUser";
import AddUser from "./Settings/AddUser";
import "../../../styles/Chat.css";
import { ChatContext } from "../../../contexts/chat/ChatContext";

const Chat = () => {
    const chat = useContext(ChatContext);

    return (
        <div id="chat">
            {chat.page === "YourChannels" && <YourChannels />}
            {chat.page === "ChannelsList" && <ChannelsList />}
            {chat.page === "JoinProtected" && <JoinProtected />}
            {chat.page === "CreateChannel" && <CreateChannel />}
            {chat.page === "CreatePrivate" && <CreatePrivate />}
            {chat.page === "ChatConv" && <ChatConv />}
            {chat.page === "EditChannelPassword" && <EditChannelPassword />}
            {chat.page === "EditAdmins" && <EditAdmins />}
            {chat.page === "AddUser" && <AddUser />}
            {chat.page === "KickUser" && <KickUser />}
            {chat.page === "BanUser" && <BanUser />}
            {chat.page === "MuteUser" && <MuteUser />}
        </div>
    );
};

export default Chat;
