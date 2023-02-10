import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "./GetCookie";
import axios from "axios";

const ProtectedPage = (props: any) => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(true);

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
    useEffect(() => {
        console.log("UseEffect in ProtectedPage");
    });

    return <>{isLoggedIn === true ? props.children : null}</>;
};

export default ProtectedPage;
