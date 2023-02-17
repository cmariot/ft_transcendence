import "../../CSS/Chat.css";
import YourChannels from "./YourChannels";
import ChannelsList from "./ChannelsList";
import CreateChannel from "./CreateChannel";
import ChatConv from "./ChatConv";
import JoinProtected from "./JoinProtectedChannel";
import CreatePrivate from "./CreatePrivate";
import EditChannelPassword from "./EditChannelPassword";

// List of menus for the chat, by default all are hidden except 'YourChannels'
const Chat = () => {
    return (
        <div id="chat">
            <YourChannels />
            <ChannelsList />
            <JoinProtected />
            <CreateChannel />
            <CreatePrivate />
            <ChatConv />
            <EditChannelPassword />
        </div>
    );
};

export default Chat;
