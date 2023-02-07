import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CSS/AppNavBar.css";

function AppNavBar(props) {
    const navigate = useNavigate();

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
                            go("/profile");
                        }}
                    >
                        Profile
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
