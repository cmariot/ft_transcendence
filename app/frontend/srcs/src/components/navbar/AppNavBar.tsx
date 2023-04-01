import { Link } from "react-router-dom";
import "../../styles/AppNavBar.css";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../contexts/sockets/SocketProvider";
import { ChatContext } from "../../contexts/chat/ChatContext";
import { MenuContext } from "../../contexts/menu/MenuContext";
import { UserContext } from "../../contexts/user/UserContext";

const AppNavBar = () => {
    const menu = useContext(MenuContext);
    const user = useContext(UserContext);
    const chat = useContext(ChatContext);
    const socket = useContext(SocketContext);

    const [, setUpdate] = useState(false);

    function toogleMenu(event: { preventDefault: () => void }) {
        event.preventDefault();
        menu.toogle();
        chat.closeMenu();
    }

    function toogleNotifs(event: { preventDefault: () => void }) {
        event.preventDefault();
        menu.toogleNotifs();
    }

    // When new notification
    useEffect(() => {
        function updateNotifications(notif: { message: string; type: string }) {
            var notifs = user.notifications;
            notifs.push(notif);
            user.setNotifications(notifs);
            setUpdate((prevState) => !prevState);
        }
        socket.on("user.new.notif", updateNotifications);
        return () => {
            socket.off("user.new.notif", updateNotifications);
        };
    }, [user, socket]);

    // When a notification is erased
    useEffect(() => {
        function updateNotifications(data: {
            message: string;
            type: string;
            index: number;
        }) {
            var notifs = user.notifications;
            var notif = notifs.at(data.index);
            if (
                notif &&
                notif.message === data.message &&
                notif.type === data.type
            ) {
                notifs.splice(data.index, 1);
                user.setNotifications(notifs);
            }
            setUpdate((prevState) => !prevState);
        }
        socket.on("user.delete.notif", updateNotifications);
        return () => {
            socket.off("user.delete.notif", updateNotifications);
        };
    }, [user, socket]);

    return (
        <header>
            <nav id="app-nav-bar">
                <Link to="/" onClick={() => menu.close()}>
                    ft_transcendence
                </Link>
                {user.username && user.avatar ? (
                    <div id="nav-user-infos">
                        <button onClick={toogleNotifs}>
                            {user.notifications.length} notification
                            {user.notifications.length > 1 && "s"}
                        </button>
                        <button onClick={toogleMenu}>{user.username}</button>
                        <img
                            id="nav-user-picture"
                            src={`${user.avatar}`}
                            alt="Menu"
                            onClick={toogleMenu}
                        />
                    </div>
                ) : (
                    <button onClick={toogleMenu}>menu</button>
                )}
            </nav>
        </header>
    );
};

export default AppNavBar;
