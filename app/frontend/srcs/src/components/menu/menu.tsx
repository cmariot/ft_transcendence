import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "../../contexts/user/UserContext";
import { MenuContext } from "../../contexts/menu/MenuContext";

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
            user.setClickOnLogout(true);
            return navigate("/login");
        } catch (error: any) {
            menu.displayError(error.response.data);
        }
    }

    useEffect(() => {
        if (user.isForcedLogout) {
            menu.close();
        }
    }, [user.isForcedLogout, menu]);

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
