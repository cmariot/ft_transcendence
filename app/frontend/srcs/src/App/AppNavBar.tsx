import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CSS/AppNavBar.css";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./App";
import { socket } from "../Contexts/WebsocketContext";

function AppNavBar() {
    const navigate = useNavigate();
    let user = useContext(UserContext);
    const [username, setUsername] = useState(user.username);
    const [avatar, setAvatar] = useState(user.avatar);

    function go(path: string) {
        toogleMenu();
        navigate(path);
    }

    function goLogout() {
        toogleMenu();
        axios
            .get("/api/logout")
            .then(() => {
                navigate("/login");
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
        var menuBox = document.getElementById("app-menu");
        var app = document.getElementById("app-content");
        if (menuBox && app) {
            if (menuBox.style.display === "flex") {
                menuBox.style.display = "none";
                app.style.display = "";
            } else {
                menuBox.style.display = "flex";
                app.style.display = "none";
            }
        }
    }

    function closeMenu() {
        var menuBox = document.getElementById("app-menu");
        var app = document.getElementById("app-content");
        if (menuBox && app) {
            if (menuBox.style.display === "flex") {
                menuBox.style.display = "none";
                app.style.display = "";
            }
        }
    }

    useEffect(() => {
        setUsername(user.username);
        setAvatar(user.avatar);
    }, [user]);

    return (
        <>
            <header>
                <nav id="app-nav-bar">
                    <Link to="/" onClick={closeMenu}>
                        ft_transcendence
                    </Link>
                    <div id="nav-user-infos">
                        <button onClick={toogleMenu}>{username}</button>
                        <img
                            id="nav-user-picture"
                            src={avatar}
                            onClick={toogleMenu}
                            alt="Menu"
                        />
                    </div>
                </nav>
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
            </header>
        </>
    );
}

export default AppNavBar;
