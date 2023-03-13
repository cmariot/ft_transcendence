import { Outlet } from "react-router-dom";
import { Footer } from "../footer";
import { useContext } from "react";
import { Menu } from "../menu/menu";
import { MenuContext } from "../../contexts/MenuProviders";
import { NavBar } from "../navbar";

export const Body = () => {
    const menu = useContext(MenuContext);

    return (
        <>
            <NavBar />
            {menu.display ? <Menu /> : <Outlet />}
            <Footer />
        </>
    );
};
