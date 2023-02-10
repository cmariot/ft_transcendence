import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "./GetCookie";
import axios from "axios";

const ProtectedDoubleAuth = (props: any) => {
    const [isDoubleAuthorized, setIsDoubleAuthorized] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const validateConnexion = async () => {
            const userToken = getCookie("double_authentification");
            if (!userToken || userToken === "undefined") {
                setIsDoubleAuthorized(false);
                return navigate("/login");
            }
            await axios
                .get("/api/authorization/double-authentification")
                .then(function () {
                    setIsDoubleAuthorized(true);
                    return;
                })
                .catch(function () {
                    setIsDoubleAuthorized(false);
                    return navigate("/login");
                });
        };
        validateConnexion();
    }, [isDoubleAuthorized, navigate]);

    return <>{isDoubleAuthorized === true ? props.children : null}</>;
};
export default ProtectedDoubleAuth;
