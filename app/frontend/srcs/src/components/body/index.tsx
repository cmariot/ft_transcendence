import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { NavBar } from "../navbar/index";
import { Footer } from "../footer/index";
import ErrorPage from "../../utils/ErrorPage";
import { MenuContext } from "../../contexts/menu/MenuContext";

export const Body = () => {
    const menu = useContext(MenuContext);

    return (
        <>
            <NavBar />
            <div id="app-content" className="main-app-div">
                {menu.error ? <ErrorPage /> : <Outlet />}
            </div>
            <Footer />
        </>
    );
};
