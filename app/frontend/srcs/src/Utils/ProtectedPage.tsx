import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getCookie } from "./GetCookie";
import axios from "axios";

const ProtectedPage = (props: any) => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    useEffect(() => {
        const validateConnexion = () => {
            const userToken = getCookie("authentification");
            if (!userToken || userToken === "undefined") {
                setIsLoggedIn(false);
                return navigate("/login");
            }
            axios
                .get("/api/authorization/logged")
                .then(function () {
                    return;
                })
                .catch(function () {
                    setIsLoggedIn(false);
                    return navigate("/login");
                });
        };
        validateConnexion();
    });

    return <>{isLoggedIn === true ? <Outlet /> : null}</>;
};

export default ProtectedPage;
