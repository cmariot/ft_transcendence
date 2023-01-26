import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AppNavbar from "./AppNavBar";
import AppFooter from "./AppFooter";
import { getCookie } from "../Utils/GetCookie";

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
            <AppNavbar />
            <Outlet />
            <AppFooter />
        </>
    );
}
export default App;
