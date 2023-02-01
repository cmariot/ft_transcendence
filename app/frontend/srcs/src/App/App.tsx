import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AppNavbar from "./AppNavBar";
import AppFooter from "./AppFooter";
import axios from "axios";

function App() {
    const [firstLoad, setFirstLoad] = useState(true);
    const [username, setUsername] = useState("");
    const [userImage, setUserImage] = useState("");

    const context = {
        username,
        setUsername,
        userImage,
        setUserImage,
    };

    const getProfile = async function () {
        await axios
            .get("/api/profile")
            .then((response) => {
                console.log("APP PROFILE : ", response.data);
                if (firstLoad) {
                    setUserImage("/api/profile/image");
                    setFirstLoad(false);
                } else {
                    setUserImage(context.userImage);
                }
                setUsername(response.data.username);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        getProfile();
    }, [firstLoad, context.username, context.userImage]);

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
