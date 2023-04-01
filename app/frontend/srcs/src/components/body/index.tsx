import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { NavBar } from "../navbar/index";
import { Menu } from "../menu/menu";
import { Footer } from "../footer/index";
import ErrorPage from "../../utils/ErrorPage";
import { Notifications } from "../notifications/notifications";
import { MenuContext } from "../../contexts/menu/MenuContext";

export const Body = () => {
    const menu = useContext(MenuContext);

    return (
        <>
            <NavBar />
            {menu.error ? (
                <ErrorPage />
            ) : menu.display ? (
                <Menu />
            ) : menu.displayNotifs ? (
                <Notifications />
            ) : (
                <Outlet />
            )}
            <Footer />
        </>
    );
};
