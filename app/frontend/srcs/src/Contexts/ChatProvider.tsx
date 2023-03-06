import { createContext } from "react";

export type ChatContextType = {};

export const ChatContext = createContext({});

type ChatProviderProps = { children: JSX.Element | JSX.Element[] };
const ChatProvider = ({ children }: ChatProviderProps) => {
    const value = {};

    return (
        <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
    );
};

export default ChatProvider;
