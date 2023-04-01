import { ChatEvents } from "./chat/ChatEvents";
import { GameEvents } from "./game/GameEvents";
import { UserEvents } from "./user/UserEvents";

// This is the WSEvents component that is used
// to provide the websocket events to the children
type WSEventsProps = { children: JSX.Element | JSX.Element[] };
const WSEvents = ({ children }: WSEventsProps) => {
    return (
        <UserEvents>
            <ChatEvents>
                <GameEvents>{children}</GameEvents>
            </ChatEvents>
        </UserEvents>
    );
};

export default WSEvents;
