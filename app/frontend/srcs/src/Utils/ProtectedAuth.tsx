import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "./GetCookie";
import axios from "axios";

const ProtectedAuth = (props) => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    function validateConnexion() {
        console.log("Test cookie authentification");
        const userToken = getCookie("authentification");
        if (!userToken || userToken === "undefined") {
            setIsLoggedIn(false);
            return navigate("/login");
        }
        axios
            .get("/api/test/isLogged")
            .then(function () {
                console.log("OK");
                setIsLoggedIn(true);
                return;
            })
            .catch(function (error) {
                console.log("KO");
                return navigate("/login");
            });
    }

    useEffect(() => {
        validateConnexion();
    }, [isLoggedIn]);

    return <>{isLoggedIn ? props.children : null}</>;
};

export default ProtectedAuth;
