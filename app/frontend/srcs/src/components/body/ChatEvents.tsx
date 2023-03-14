import { useContext, useEffect } from "react";
import { UserContext } from "../../contexts/UserProvider";
import { SocketContext } from "../../contexts/SocketProvider";

type ChatEventsProps = { children: JSX.Element | JSX.Element[] };
export const ChatEvents = ({ children }: ChatEventsProps) => {
    const user = useContext(UserContext);
    const socket = useContext(SocketContext);

    // When the current user is forced to logout by the backend
    useEffect(() => {
        function logout() {}
        socket.on("user.disconnect", logout);
        return () => {
            socket.off("user.disconnect", logout);
        };
    }, [user, socket]);

    return <>{children}</>;
};
