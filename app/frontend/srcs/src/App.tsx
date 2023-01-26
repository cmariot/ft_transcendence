import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import HomeNavbar from "./home/navbar/HomeNavBar";
import HomeFooter from "./home/footer/HomeFooter";
import { getCookie } from "./auth/login/LoginLocal";

function App() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const checkUserToken = () => {
        const userToken = getCookie("authentification");
        if (!userToken || userToken === "undefined") {
            setIsLoggedIn(false);
            return navigate("/login");
        }
        setIsLoggedIn(true);
    };
    useEffect(() => {
        checkUserToken();
    }, [isLoggedIn]);

    return (
        <>
            <HomeNavbar />
            <Outlet />
            <HomeFooter />
        </>
    );
}
export default App;
