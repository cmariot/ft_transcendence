import { createContext } from "react";

var chat = {
    currentChannel: "",
    currentChannelMessages: [],
    availableChannels: [],
};

const ChatContext = createContext(chat);
export default ChatContext;
