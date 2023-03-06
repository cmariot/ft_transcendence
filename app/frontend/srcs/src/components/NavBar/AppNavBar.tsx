import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/AppNavBar.css";
import { useState } from "react";
import { socket } from "../../Contexts/WebsocketContext";
import { UserContextType } from "../../Contexts/UserProvider";

export type AppNavBarProps = {
    user: UserContextType;
};
const AppNavBar = ({ user }: AppNavBarProps) => {
    const navigate = useNavigate();

    const [showMenu, setShowMenu] = useState(false);

    function go(path: string) {
        toogleMenu();
        navigate(path);
    }

    function goLogout() {
        axios
            .get("/api/logout")
            .then(() => {
                navigate("/");
                socket.emit("userStatus", {
                    status: "Offline",
                    socket: socket.id,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function toogleMenu() {
        setShowMenu(!showMenu);
    }

    function closeMenu() {
        setShowMenu(false);
    }

    return (
        <>
            <header>
                <nav id="app-nav-bar">
                    <Link to="/" onClick={closeMenu}>
                        ft_transcendence
                    </Link>
                    <div id="nav-user-infos">
                        <button onClick={toogleMenu}>{user?.username}</button>
                        <img
                            id="nav-user-picture"
                            src={user?.avatar}
                            onClick={toogleMenu}
                            alt="Menu"
                        />
                    </div>
                </nav>

                {showMenu && (
                    <menu id="app-menu">
                        <button
                            className="app-menu-button"
                            onClick={() => {
                                go("/");
                            }}
                        >
                            Home
                        </button>
                        <button
                            className="app-menu-button"
                            onClick={() => {
                                go("/friends");
                            }}
                        >
                            Friends
                        </button>
                        <button
                            className="app-menu-button"
                            onClick={() => {
                                go("/profile");
                            }}
                        >
                            Profile
                        </button>
                        <button
                            className="app-menu-button"
                            onClick={() => {
                                go("/settings");
                            }}
                        >
                            Settings
                        </button>
                        <button className="app-menu-button" onClick={goLogout}>
                            Logout
                        </button>
                    </menu>
                )}
            </header>
        </>
    );
};

export default AppNavBar;
