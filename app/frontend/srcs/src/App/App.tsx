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
    const [userImage, setUserImage] = useState("/api/profile/image");
    const [email, setEmail] = useState("");
    const [valideEmail, setValideEmail] = useState(false);

    const context = {
        username,
        setUsername,
        userImage,
        setUserImage,
        email,
        setEmail,
    };

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
                console.log("PROFIL : ", response.data);
                setValideEmail(response.data.valideEmail);
                if (response.data.valideEmail === false) {
                    console.log("ICI", valideEmail);
                    navigate("/validate");
                    return;
                }
                setUsername(response.data.username);
                setEmail(response.data.email);
                setUserImage(context.userImage);
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
    }, [isLoggedIn, context.username, context.userImage, context.email]);

    return (
        <>
            <AppNavbar username={username} userImage={userImage} />
            <div id="app-content">
                <Outlet context={context} />
            </div>
            <AppFooter />
        </>
    );
}
export default App;
