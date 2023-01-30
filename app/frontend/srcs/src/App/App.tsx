import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AppNavbar from "./AppNavBar";
import AppFooter from "./AppFooter";
import { getCookie } from "../Utils/GetCookie";
import axios from "axios";

function App() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [profileUpdated, setUpdateProfile] = useState(false);

    const validateConnexion = async function () {
        const userToken = getCookie("authentification");
        if (!userToken || userToken === "undefined") {
            setIsLoggedIn(false);
            return navigate("/login");
        }
        setIsLoggedIn(true);
        await axios
            .get("/api/profile")
            .then((response) => {
                setUsername(response.data.username);
            })
            .catch((error) => {
                console.log(error);
                logout();
            });
    };

    const logout = () => {
        axios
            .get("/api/logout")
            .then(() => {
                setIsLoggedIn(false);
                navigate("/login");
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        validateConnexion();
    }, [isLoggedIn, profileUpdated]);

    return (
        <>
            <AppNavbar username={username} />
            <div id="app-content">
                <Outlet />
            </div>
            <AppFooter />
        </>
    );
}
export default App;
