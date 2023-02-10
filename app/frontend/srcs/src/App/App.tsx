import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AppNavbar from "./AppNavBar";
import AppFooter from "./AppFooter";
import axios from "axios";
import { WebsocketProvider, socket } from "../Websockets/WebsocketContext";

function App() {
    const [firstLoad, setFirstLoad] = useState(true);
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

    useEffect(() => {
        const getProfile = async () => {
            setFirstLoad(false);
            await axios
                .get("/api/profile")
                .then((response) => {
                    user["setUsername"](response.data.username);
                    user["setDoubleAuth"](response.data.twoFactorsAuth);
                    user["setUserImage"](
                        "/api/profile/" + response.data.username + "/image"
                    );
                    socket.emit("userStatus", {
                        status: "Online",
                        socket: socket.id,
                        username: response.data.username,
                    });
                })
                .catch((error) => {
                    console.log(error.response);
                    return;
                });
        };
        if (firstLoad) {
            getProfile();
        }
    });

    return (
        <WebsocketProvider value={socket}>
            <AppNavbar user={user} />
            <section id="app-content">
                <Outlet context={user} />
            </section>
            <AppFooter />
        </WebsocketProvider>
    );
}
export default App;
