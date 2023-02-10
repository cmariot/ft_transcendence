import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "./GetCookie";
import axios from "axios";

const ProtectedPage = (props: any) => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const validateConnexion = async () => {
            const userToken = getCookie("authentification");
            if (!userToken || userToken === "undefined") {
                setIsLoggedIn(false);
                return navigate("/login");
            }
            await axios
                .get("/api/authorization/logged")
                .then(function () {
                    setIsLoggedIn(true);
                    return;
                })
                .catch(function () {
                    setIsLoggedIn(false);
                    return navigate("/login");
                });
        };
        validateConnexion();
    }, [isLoggedIn, navigate]);

    return <>{isLoggedIn === true ? props.children : null}</>;
};

export default ProtectedPage;
