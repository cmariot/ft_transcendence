import { Outlet } from "react-router-dom";
import { Footer } from "../Footer";
import { NavBar } from "../NavBar";
import { useContext } from "react";
import { Menu } from "../Menu/menu";
import { MenuContext } from "../../Contexts/MenuProviders";

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
