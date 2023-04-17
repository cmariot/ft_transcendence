import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../contexts/sockets/SocketProvider";
import { MenuContext } from "../../contexts/menu/MenuContext";
import { UserContext } from "../../contexts/user/UserContext";
import { ImageContext } from "../../contexts/images/ImagesContext";
import { GameContext } from "../../contexts/game/GameContext";

const AppNavBar = () => {
    const menu = useContext(MenuContext);
    const user = useContext(UserContext);
    const game = useContext(GameContext);
    const socket = useContext(SocketContext);
    const images = useContext(ImageContext);

    const [, setUpdate] = useState(false);

    // Toggle navigation menu
    function toogleMenu(event: { preventDefault: () => void }) {
        event.preventDefault();
        menu.toogle();
    }

    // Toggle notifications menu
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
        <header id="app-header">
            <nav id="app-nav">
                <div id="nav-left">
                    <Link to="/" onClick={() => menu.close()} id="app-nav-home">
                        <img id="nav-logo" src={images.logo} alt="Logo" />
                        <p id="home-text">ft_transcendence</p>
                    </Link>
                </div>
                <div id="nav-user-infos">
                    {user.notifications.length > 0 && (
                        <Link to="" id="app-nav-notif" onClick={toogleNotifs}>
                            <p id="nb-notif">{user.notifications.length}</p>
                            <img
                                id="notif-icon"
                                src={images.notifs}
                                alt="Notifications"
                            />
                        </Link>
                    )}
                    {user.username && user.avatar ? (
                        <>
                            <Link id="nav-username" to="" onClick={toogleMenu}>
                                {user.username}
                            </Link>
                            <img
                                id="nav-user-picture"
                                src={`${user.avatar}`}
                                alt="Menu"
                                onClick={toogleMenu}
                            />
                        </>
                    ) : (
                        <button onClick={toogleMenu}>menu</button>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default AppNavBar;
