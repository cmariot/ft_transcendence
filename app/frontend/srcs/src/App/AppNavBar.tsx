import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CSS/AppNavBar.css";

function AppNavBar(props) {
    const navigate = useNavigate();

    function logout() {
        toogleMenu();
        axios
            .get("/api/logout")
            .then(() => {
                navigate("/login");
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function toogleMenu() {
        var menuBox = document.getElementById("app-menu");
        var app = document.getElementById("app-content");
        if (menuBox.style.display == "flex") {
            menuBox.style.display = "none";
            app.style.display = "";
        } else {
            menuBox.style.display = "flex";
            app.style.display = "none";
        }
    }

    function closeMenu() {
        var menuBox = document.getElementById("app-menu");
        var app = document.getElementById("app-content");
        if (menuBox.style.display == "flex") {
            menuBox.style.display = "none";
            app.style.display = "";
        }
    }

    return (
        <>
            <header>
                <nav id="app-nav-bar">
                    <Link to="/" onClick={closeMenu}>
                        ft_transcendence
                    </Link>
                    <div id="nav-user-infos">
                        <button onClick={toogleMenu}>
                            {props.user["username"]}
                        </button>
                        <img
                            id="nav-user-picture"
                            src={props.user["userImage"]}
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
                        <li className="app-menu-li">
						<Link to="/friends" onClick={toogleMenu}>
								Friends
                            </Link>
						</li>
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
}

export default AppNavBar;
