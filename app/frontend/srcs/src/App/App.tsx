import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AppNavbar from "./AppNavBar";
import AppFooter from "./AppFooter";
import axios from "axios";

function App() {
    const [firstLoad, setFirstLoad] = useState(true);
    const [username, setUsername] = useState("");
    const [userImage, setUserImage] = useState("");
    const [doubleAuth, setDoubleAuth] = useState(true);

    const context = {
        username: username,
        setUsername: setUsername,
        userImage,
        setUserImage: setUserImage,
        doubleAuth: doubleAuth,
        setDoubleAuth: setDoubleAuth,
    };

    const getProfile = async function () {
        await axios
            .get("/api/profile")
            .then((response) => {
                context.setUsername(response.data.username);
                context.setDoubleAuth(response.data.twoFactorsAuth);
                if (firstLoad) {
                    setUserImage(
                        "/api/profile/" + response.data.username + "/image"
                    );
                    setFirstLoad(false);
                } else {
                    setUserImage(context.userImage);
                }
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
            <AppNavbar username={username} userImage={userImage} />
            <section id="app-content">
                <Outlet context={context} />
            </section>
            <AppFooter />
        </>
    );
}
export default App;
