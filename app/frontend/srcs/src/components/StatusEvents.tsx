import { useContext, useEffect } from "react";
import { UserContext } from "../contexts/UserProvider";
import { SocketContext } from "../contexts/SocketProvider";

type StatusEventsProps = { children: JSX.Element | JSX.Element[] };
export const StatusEvents = ({ children }: StatusEventsProps) => {
    const user = useContext(UserContext);
    const socket = useContext(SocketContext);

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
        function logout() {
            user.setIsForcedLogout(true);
            user.setStatus("offline");
        }
        socket.on("user.disconnect", logout);
        return () => {
            socket.off("user.disconnect", logout);
        };
    }, [user, socket]);

    // Subscribe to status.update : update the user status or friends status
    useEffect(() => {
        function updateStatus(data: { username: string; status: string }) {
            if (data.username === user.username) {
                user.setStatus(data.status);
            } else {
                let friends = user.friends;
                const index = friends.findIndex(
                    (friend) => friend.username === data.username
                );
                if (index !== -1 && friends[index].status !== data.status) {
                    friends[index].status = data.status;
                    user.setFriends(friends);
                }
            }
        }
        socket.on("status.update", updateStatus);
        return () => {
            socket.off("status.update", updateStatus);
        };
    }, [user, socket]);

    return <>{children};</>;
};
