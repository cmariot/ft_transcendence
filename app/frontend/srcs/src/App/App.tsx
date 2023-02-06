import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AppNavbar from "./AppNavBar";
import AppFooter from "./AppFooter";
import axios from "axios";

function App() {
    const [username, setUsername] = useState("");
    const [userImage, setUserImage] = useState("");
    const [doubleAuth, setDoubleAuth] = useState(true);

    let user = {
        username,
        setUsername: setUsername,
        userImage,
        setUserImage: setUserImage,
        doubleAuth,
        setDoubleAuth: setDoubleAuth,
    };

    const getProfile = async function () {
        await axios
            .get("/api/profile")
            .then((response) => {
                user["setUsername"](response.data.username);
                user["setDoubleAuth"](response.data.twoFactorsAuth);
                user["setUserImage"](
                    "/api/profile/" + response.data.username + "/image"
                );
            })
            .catch((error) => {
                console.log(error.response);
                return;
            });
    };

    useEffect(() => {
        getProfile();
    }, []);

    return (
        <>
            <AppNavbar user={user} />
            <section id="app-content">
                <Outlet context={user} />
            </section>
            <AppFooter />
        </>
    );
}
export default App;
