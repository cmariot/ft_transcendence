import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "./GetCookie";
import axios from "axios";

const ProtectedDoubleAuth = (props: any) => {
    const navigate = useNavigate();
    const [isDoubleAuthorized, setIsDoubleAuthorized] = useState(false);

    function validateDoubleAuth() {
        const userToken = getCookie("double_authentification");
        if (!userToken || userToken === "undefined") {
            setIsDoubleAuthorized(false);
            return navigate("/login");
        }
        axios
            .get("/api/test/doubleAuth")
            .then(function () {
                setIsDoubleAuthorized(true);
            })
            .catch(function (error) {
                console.log(error);
                setIsDoubleAuthorized(false);
                navigate("/login");
            });
    }

    useEffect(() => {
        validateDoubleAuth();
    }, [isDoubleAuthorized]);

    return <>{isDoubleAuthorized ? props.children : null}</>;
};
export default ProtectedDoubleAuth;
