import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "../../contexts/user/UserContext";
import { MenuContext } from "../../contexts/menu/MenuContext";
import { ImageContext } from "../../contexts/images/ImagesContext";

export const Menu = () => {
    const user = useContext(UserContext);
    const menu = useContext(MenuContext);
    const images = useContext(ImageContext);

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
        <div id="app-menu" className="defaultMenuPos">
            <div className="app-menu-div">
                <img src={images.home} alt="logo" className="app-menu-icon" />
                <Link to="/" onClick={() => menu.close()}>
                    Home
                </Link>
            </div>
            <div className="app-menu-div">
                <img
                    src={images.friends}
                    alt="logo"
                    className="app-menu-icon"
                />
                <Link to="/friends" onClick={() => menu.close()}>
                    Friends
                </Link>
            </div>
            <div className="app-menu-div">
                <img
                    src={images.profile}
                    alt="logo"
                    className="app-menu-icon"
                />
                <Link to="/profile" onClick={() => menu.close()}>
                    Profile
                </Link>
            </div>
            <div className="app-menu-div">
                <img
                    src={images.settings}
                    alt="logo"
                    className="app-menu-icon"
                />
                <Link to="/settings" onClick={() => menu.close()}>
                    Settings
                </Link>
            </div>
            <div className="app-menu-div">
                <img src={images.logout} alt="logo" className="app-menu-icon" />
                <Link to="" onClick={() => goLogout()}>
                    Logout
                </Link>
            </div>
        </div>
    );
};
