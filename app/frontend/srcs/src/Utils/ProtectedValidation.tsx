import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getCookie } from "./GetCookie";
import axios from "axios";

const ProtectedValidation = () => {
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const validateConnexion = async () => {
            const userToken = getCookie("email_validation");
            if (!userToken || userToken === "undefined") {
                setIsAuthorized(false);
                return navigate("/login");
            }
            await axios
                .get("/api/authorization/email")
                .then(function () {
                    setIsAuthorized(true);
                    return;
                })
                .catch(function () {
                    setIsAuthorized(false);
                    return navigate("/login");
                });
        };
        validateConnexion();
    }, [isAuthorized, navigate]);

    return <>{isAuthorized === true ? <Outlet /> : null}</>;
};
export default ProtectedValidation;
