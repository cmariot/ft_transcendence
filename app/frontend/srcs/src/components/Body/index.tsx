import { Outlet } from "react-router-dom";
import { Footer } from "../Footer";
import { NavBar } from "../NavBar";

export const Body = () => {
    return (
        <>
            <NavBar />
            <Outlet />
            <Footer />
        </>
    );
};
