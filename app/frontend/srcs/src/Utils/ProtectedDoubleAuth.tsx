import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getCookie } from "./GetCookie";
import axios from "axios";

const ProtectedDoubleAuth = (props: any) => {
    const [isDoubleAuthorized, setIsDoubleAuthorized] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const validateConnexion = async () => {
            const userToken = getCookie("double_authentification");
            if (!userToken || userToken === "undefined") {
                return navigate("/");
            }
            await axios
                .get("/api/authorization/double-authentification")
                .then(function () {
                    setIsDoubleAuthorized(true);
                    return;
                })
                .catch(function () {
                    return navigate("/");
                });
        };
        validateConnexion();
    }, [isDoubleAuthorized, navigate]);

    return <>{isDoubleAuthorized === true ? <Outlet /> : null}</>;
};
export default ProtectedDoubleAuth;
