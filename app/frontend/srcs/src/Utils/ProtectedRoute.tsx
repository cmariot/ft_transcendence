import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "./GetCookie";
import axios from "axios";

const ProtectedRoute = (props) => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    function validateConnexion() {
        const userToken = getCookie("authentification");
        if (!userToken || userToken === "undefined") {
            setIsLoggedIn(false);
            return navigate("/login");
        }
        axios
            .get("/api/")
            .then(function () {
                setIsLoggedIn(true);
            })
            .catch(function (error) {
                console.log("ValidateConnexion : ", error);
                // if not logged in
                if (
                    error.response.data.statusCode === 401 &&
                    error.response.data.message === "Unauthorized"
                ) {
                    navigate("/login");
                }
                if (
                    error.response.data.statusCode === 401 &&
                    error.response.data.message === "Your email is not valid."
                ) {
                    // if email not validated
                    navigate("/validate");
                } else {
                }
                // if 2fa required
                //
                //    if (response.data.valideEmail === false) {
                //        navigate("/validate");
                //        return;
                //    }
            });
    }

    useEffect(() => {
        validateConnexion();
    }, [isLoggedIn]);

    return <>{isLoggedIn ? props.children : null}</>;
};
export default ProtectedRoute;
