import React, { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AppNavbar from "./AppNavBar";
import AppFooter from "./AppFooter";
import axios from "axios";
import { Websocketcontext } from "../Websockets/WebsocketContext";

function App() {
    const [username, setUsername] = useState("");
    const [userImage, setUserImage] = useState("");
    const [doubleAuth, setDoubleAuth] = useState(true);

    const [message, setMessage] = useState("");

    const socket = useContext(Websocketcontext);

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
        socket.on("onMessage", (data) => {
            console.log("onMessage event received : ", data);
            setMessage(data);
        });
        getProfile();
        return () => {
            console.log("Unregistering events ... ");
            socket.off("connect");
            socket.off("onMessage");
        };
    }, []);

    return (
        <>
            <AppNavbar user={user} />
            <section id="app-content">
                <p>{message}</p>
                <Outlet context={user} />
            </section>
            <AppFooter />
        </>
    );
}
export default App;
