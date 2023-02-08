import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "./GetCookie";
import axios from "axios";

const ProtectedValidation = (props: any) => {
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(false);

    function validateAuthorization() {
        const userToken = getCookie("email_validation");
        if (!userToken || userToken === "undefined") {
            setIsAuthorized(false);
            return navigate("/login");
        }
        axios
            .get("/api/test/emailValidation")
            .then(function () {
                setIsAuthorized(true);
            })
            .catch(function (error) {
                console.log(error);
                setIsAuthorized(false);
                navigate("/login");
            });
    }

    useEffect(() => {
        validateAuthorization();
    });

    return <>{isAuthorized ? props.children : null}</>;
};
export default ProtectedValidation;