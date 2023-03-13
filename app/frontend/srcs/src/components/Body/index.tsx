import { Outlet } from "react-router-dom";
import { Footer } from "../footer";
import { useContext } from "react";
import { Menu } from "../menu/menu";
import { MenuContext } from "../../contexts/MenuProviders";
import { NavBar } from "../navbar";
import { StatusEvents } from "../StatusEvents";

export const Body = () => {
    const menu = useContext(MenuContext);

    return (
        <StatusEvents>
            <NavBar />
            {menu.display ? <Menu /> : <Outlet />}
            <Footer />
        </StatusEvents>
    );
};
