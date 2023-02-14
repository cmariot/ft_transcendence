import "../../CSS/Chat.css";
import YourChannels from "./YourChannels";
import ChannelsList from "./ChannelsList";
import CreateChannel from "./CreateChannel";
import CreatePrivate from "./CreatePrivate";

const Chat = () => {
    return (
        <div id="chat">
            <YourChannels />
            <ChannelsList />
            <CreateChannel />
            <CreatePrivate />
        </div>
    );
};

export default Chat;
