import { Link, useNavigate } from "react-router-dom";
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

    const closeMenu = () => {
        var menuBox = document.getElementById("app-menu");
        var app = document.getElementById("app-content");
        if (menuBox.style.display == "flex") {
            menuBox.style.display = "none";
            app.style.display = "";
        }
    };

    return (
        <>
            <header>
                <nav id="app-nav-bar">
                    <Link to="/" onClick={closeMenu}>
                        ft_transcendence
                    </Link>
                    <div id="nav-user-infos">
                        <button onClick={toogleMenu}>{props.username}</button>
                        <img
                            src={props.userImage}
                            id="nav-user-picture"
                            onClick={toogleMenu}
                            alt="Menu"
                        />
                    </div>
                </nav>

                <menu id="app-menu">
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
                        <li className="app-menu-li">
                            <Link to="/settings" onClick={toogleMenu}>
                                Settings
                            </Link>
                        </li>
                        <li className="app-menu-li" onClick={logout}>
                            <Link to="" onClick={toogleMenu}>
                                Logout
                            </Link>
                        </li>
                    </ul>
                </menu>
            </header>
        </>
    );
};
export default AppNavbar;
