import { useContext, useEffect } from "react";
import { SocketContext } from "../../contexts/sockets/SocketProvider";
import { ChatContext } from "../../contexts/chat/ChatContext";
import { UserContext } from "../../contexts/user/UserContext";
import { MenuContext } from "../../contexts/menu/MenuContext";
import { logout } from "./functions/logout";
import { updateStatus } from "./functions/updateStatus";
import { updateFriendUsername } from "./functions/updateFriendUsername";
import { updateFriendAvatar } from "./functions/updateFriendAvatar";

type UserEventsProps = { children: JSX.Element | JSX.Element[] };
export const UserEvents = ({ children }: UserEventsProps) => {
    const user = useContext(UserContext);
    const socket = useContext(SocketContext);
    const menu = useContext(MenuContext);

    // Emit an event at login
    useEffect(() => {
        if (user.isLogged && user.clickOnLogin) {
            user.setClickOnLogin(false);
            socket.emit("user.login", { username: user.username });
            return () => {
                socket.off("user.login");
            };
        }
    }, [user, socket]);

    // Emit an event at logout
    useEffect(() => {
        if (user.isLogged && user.clickOnLogout) {
            user.setClickOnLogout(false);
            user.setIsLogged(false);
            socket.emit("user.logout", { username: user.username });
            return () => {
                socket.off("user.logout");
            };
        }
    }, [user, socket]);

    // When the current user is forced to logout by the backend
    useEffect(() => {
        socket.on("user.disconnect", () => logout(user));
        return () => {
            socket.off("user.disconnect", logout);
        };
    }, [user, socket]);

    // Subscribe to status.update : update the user status or friends status
    useEffect(() => {
        socket.on(
            "status.update",
            (data: { username: string; status: string }) =>
                updateStatus(data, user)
        );
        return () => {
            socket.off("status.update", updateStatus);
        };
    }, [user, socket]);

    const chat = useContext(ChatContext);

    // Subscribe to user.update.username : update the friends username
    useEffect(() => {
        socket.on("user.update.username", (data) =>
            updateFriendUsername(data, user, chat, menu)
        );
        return () => {
            socket.off("user.update.username", updateFriendUsername);
        };
    }, [user, socket, chat, menu]);

    // Subscribe to user.update.avatar : update the user avatar or friends avatar
    useEffect(() => {
        socket.on("user.update.avatar", (data: any) =>
            updateFriendAvatar(data, user)
        );
        return () => {
            socket.off("user.update.avatar", updateFriendAvatar);
        };
    }, [user]);

    // When leaderboard rank is update
    useEffect(() => {
        function updateLeaderboardRank(data: { rank: number }) {
            user.setRank(data.rank);
        }
        socket.on("rank.update", updateLeaderboardRank);
        return () => {
            socket.off("rank.update", updateLeaderboardRank);
        };
    }, [user, socket]);

    return <>{children}</>;
};
