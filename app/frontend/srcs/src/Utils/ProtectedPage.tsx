import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "./GetCookie";
import axios from "axios";
import { socket } from "../Websockets/WebsocketContext";

const ProtectedPage = (props: any) => {
    const navigate = useNavigate();
<<<<<<< HEAD
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    function validateConnexion() {
        if (isLoggedIn === false) {
            const userToken = getCookie("authentification");
            if (!userToken || userToken === "undefined") {
                setIsLoggedIn(false);
                return navigate("/login");
            }
            axios
                .get("/api/test/isLogged")
                .then(function (response) {
                    setIsLoggedIn(true);
                    return;
                })
                .catch(function (error) {
                    setIsLoggedIn(false);
                    return navigate("/login");
                });
        }
    }
=======
    let isLoggedInRef = useRef(true);
>>>>>>> 68f5bd4c548d3da9f3202504c8f62258c7331607

    useEffect(() => {
        console.log("UseEffect in ProtectedPage");
        const userToken = getCookie("authentification");
        if (!userToken || userToken === "undefined") {
            isLoggedInRef.current = false;
            return navigate("/login");
        }
        axios
            .get("/api/test/isLogged")
            .then(function () {
                return;
            })
            .catch(function (error) {
                isLoggedInRef.current = false;
                return navigate("/login");
            });
    });

    return <>{isLoggedInRef.current === true ? props.children : null}</>;
};

export default ProtectedPage;
