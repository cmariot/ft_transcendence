import "../../CSS/Chat.css";
import YourChannels from "./YourChannels";
import ChannelsList from "./ChannelsList";
import CreateChannel from "./CreateChannel";
import ChatConv from "./ChatConv";
import JoinProtected from "./JoinProtectedChannel";

const Chat = () => {
    return (
        <div id="chat">
            <YourChannels />
            <ChannelsList />
            <JoinProtected />
            <CreateChannel />
            <ChatConv />
        </div>
    );
};

export default Chat;
