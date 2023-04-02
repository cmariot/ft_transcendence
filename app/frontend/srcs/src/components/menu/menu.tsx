import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "../../contexts/user/UserContext";
import { MenuContext } from "../../contexts/menu/MenuContext";

export const Menu = () => {
    const user = useContext(UserContext);
    const menu = useContext(MenuContext);
    const navigate = useNavigate();

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
        <div id="app-menu">
            <Link to="/" onClick={() => menu.close()}>
                Home
            </Link>
            <Link to="/friends" onClick={() => menu.close()}>
                Friends
            </Link>
            <Link to="/profile" onClick={() => menu.close()}>
                Profile
            </Link>
            <Link to="/settings" onClick={() => menu.close()}>
                Settings
            </Link>
            <Link to="" onClick={() => goLogout()}>
                Logout
            </Link>
        </div>
    );
};
