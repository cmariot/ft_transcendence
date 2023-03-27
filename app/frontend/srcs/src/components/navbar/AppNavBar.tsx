import { Link } from "react-router-dom";
import "../../styles/AppNavBar.css";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserProvider";
import { MenuContext } from "../../contexts/MenuProviders";
import { ChatContext } from "../../contexts/ChatProvider";
import { SocketContext } from "../../contexts/SocketProvider";

const AppNavBar = () => {
    const menu = useContext(MenuContext);
    const user = useContext(UserContext);
    const chat = useContext(ChatContext);
    const socket = useContext(SocketContext);

    const [update, setUpdate] = useState(false);

    function toogleMenu() {
        menu.toogle();
        chat.closeMenu();
    }

    function toogleNotifs() {
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

    return (
        <header>
            <nav id="app-nav-bar">
                <Link to="/" onClick={() => menu.close()}>
                    ft_transcendence
                </Link>

                {user?.username && user?.avatar ? (
                    <div id="nav-user-infos">
                        {user.notifications.length > -1 && (
                            <button onClick={toogleNotifs}>
                                {user.notifications.length} notification(s)
                            </button>
                        )}
                        <button onClick={() => toogleMenu()}>
                            {user?.username}
                        </button>
                        <img
                            id="nav-user-picture"
                            src={user.avatar}
                            onClick={() => toogleMenu()}
                            alt="Menu"
                        />
                    </div>
                ) : (
                    <button onClick={() => toogleMenu()}>menu</button>
                )}
            </nav>
        </header>
    );
};

export default AppNavBar;
