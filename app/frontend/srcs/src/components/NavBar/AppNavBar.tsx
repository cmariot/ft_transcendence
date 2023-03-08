import { Link } from "react-router-dom";
import "../../styles/AppNavBar.css";
import { useContext } from "react";
import { UserContext } from "../../Contexts/UserProvider";
import { MenuContext } from "../../Contexts/MenuProviders";
import { ChatContext } from "../../Contexts/ChatProvider";

const AppNavBar = () => {
    const menu = useContext(MenuContext);
    const user = useContext(UserContext);
    const chat = useContext(ChatContext);

    function toogleMenu() {
        menu.toogle();
        chat.closeMenu();
    }

    return (
        <>
            <header>
                <nav id="app-nav-bar">
                    <Link to="/" onClick={() => menu.close()}>
                        ft_transcendence
                    </Link>
                    {user?.username && user?.avatar ? (
                        <div id="nav-user-infos">
                            <button onClick={() => toogleMenu()}>
                                {user?.username}
                            </button>
                            <img
                                id="nav-user-picture"
                                src={user?.avatar}
                                onClick={() => toogleMenu()}
                                alt="Menu"
                            />
                        </div>
                    ) : (
                        <button onClick={() => toogleMenu()}>menu</button>
                    )}
                </nav>
            </header>
        </>
    );
};

export default AppNavBar;
