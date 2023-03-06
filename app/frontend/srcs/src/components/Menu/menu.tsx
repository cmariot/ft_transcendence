import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Contexts/UserProvider";
import { useContext } from "react";
import { socket } from "../../Contexts/WebsocketContext";
import { MenuContext } from "../../Contexts/MenuProviders";

export const Menu = () => {
    const user = useContext(UserContext);
    const menu = useContext(MenuContext);
    const navigate = useNavigate();

    function go(path: string) {
        menu.close();
        return navigate(path);
    }

    async function goLogout() {
        try {
            await axios.get("/api/logout");
            menu.close();
            user.setIsLogged(false);
            socket.emit("userStatus", {
                status: "Offline",
                socket: socket.id,
            });
            return navigate("/login");
        } catch (error) {
            console.log(error);
        }
    }

    return (
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
    );
};