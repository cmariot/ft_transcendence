import { Link } from "react-router-dom";
import "../../styles/AppNavBar.css";
import { useContext } from "react";
import { UserContext } from "../../Contexts/UserProvider";
import { MenuContext } from "../../Contexts/MenuProviders";

const AppNavBar = () => {
    const menu = useContext(MenuContext);
    const user = useContext(UserContext);

    return (
        <>
            <header>
                <nav id="app-nav-bar">
                    <Link to="/" onClick={() => menu.close()}>
                        ft_transcendence
                    </Link>
                    {user?.username && user?.avatar ? (
                        <div id="nav-user-infos">
                            <button onClick={() => menu.toogle()}>
                                {user?.username}
                            </button>
                            <img
                                id="nav-user-picture"
                                src={user?.avatar}
                                onClick={() => menu.toogle()}
                                alt="Menu"
                            />
                        </div>
                    ) : (
                        <button onClick={() => menu.toogle()}>menu</button>
                    )}
                </nav>
            </header>
        </>
    );
};

export default AppNavBar;
