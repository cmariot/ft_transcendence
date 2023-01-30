import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./CSS/AppNavBar.css";

const AppNavbar = (props) => {
    const navigate = useNavigate();

    const logout = () => {
        toogleMenu();
        axios
            .get("/api/logout")
            .then(() => {
                navigate("/login");
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const toogleMenu = () => {
        console.log("Toogle Menu");
        var menuBox = document.getElementById("app-menu");
        var app = document.getElementById("app-content");
        if (menuBox.style.display == "flex") {
            menuBox.style.display = "none";
            app.style.display = "";
        } else {
            menuBox.style.display = "flex";
            app.style.display = "none";
        }
    };

    return (
        <>
            <nav>
                <div id="app-nav-bar">
                    <Link to="/">ft_transcendence</Link>
                    <div id="nav-user-infos">
                        <button onClick={toogleMenu}>{props.username}</button>
                        <img
                            src="/api/profile/image"
                            id="nav-user-picture"
                            onClick={toogleMenu}
                        />
                    </div>
                </div>

                <div id="app-menu">
                    <ul id="app-menu-ul">
                        <li className="app-menu-li">
                            <Link to="/" onClick={toogleMenu}>
                                Home
                            </Link>
                        </li>
                        <li className="app-menu-li">
                            <Link to="/profile" onClick={toogleMenu}>
                                Profile
                            </Link>
                        </li>
                        <li className="app-menu-li">Friends</li>
                        <li className="app-menu-li">Stats</li>
                        <li className="app-menu-li">Settings</li>
                        <li className="app-menu-li" onClick={logout}>
                            <Link to="" onClick={toogleMenu}>
                                Logout
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    );
};
export default AppNavbar;
