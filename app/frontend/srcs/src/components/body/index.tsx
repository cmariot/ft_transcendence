import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { NavBar } from "../navbar/index";
import { Menu } from "../menu/menu";
import { Footer } from "../footer/index";
import ErrorPage from "../../utils/ErrorPage";
import { Notifications } from "../notifications/notifications";
import { MenuContext } from "../../contexts/menu/MenuContext";
import { UserContext } from "../../contexts/user/UserContext";

export const Body = () => {
    const menu = useContext(MenuContext);

    const user = useContext(UserContext);

    return (
        <>
            <NavBar />
            <div id="app-content">
                {menu.error ? <ErrorPage /> : <Outlet />}
            </div>
            <Footer />
        </>
    );
};
