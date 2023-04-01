import UserProvider from "./user/UserProvider";
import ChatProvider from "./chat/ChatProvider";
import GameProvider from "./game/GameProvider";
import MenuProvider from "./menu/MenuProviders";
import SocketProvider from "./sockets/SocketProvider";

// This is the ContextProviders component that is used
// to wrap the entire application with all the context providers
type ContextProvidersProps = { children: JSX.Element | JSX.Element[] };
const ContextProviders = ({ children }: ContextProvidersProps) => {
    return (
        <UserProvider>
            <ChatProvider>
                <GameProvider>
                    <MenuProvider>
                        <SocketProvider>{children}</SocketProvider>
                    </MenuProvider>
                </GameProvider>
            </ChatProvider>
        </UserProvider>
    );
};

export default ContextProviders;
