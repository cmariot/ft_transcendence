import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AppNavbar from "./AppNavBar";
import AppFooter from "./AppFooter";
import axios from "axios";

function App() {
    const [firstLoad, setFirstLoad] = useState(true);
    const [username, setUsername] = useState("");
    const [userImage, setUserImage] = useState("/api/profile/image");
    const [doubleAuth, setDoubleAuth] = useState(true);

    const context = {
        username,
        setUsername,
        userImage,
        setUserImage,
        doubleAuth,
        setDoubleAuth,
    };

    const getProfile = async function () {
        await axios
            .get("/api/profile")
            .then((response) => {
                console.log(response.data);
                setUsername(response.data.username);
                setDoubleAuth(response.data.twoFactorsAuth);
                if (firstLoad) {
                    setUserImage("/api/" + response.data.username + "/image");
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
    }, [context.username, context.userImage]);

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
