import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getCookie } from "./GetCookie";
import axios from "axios";

const ProtectedValidation = () => {
    let isAuthorizedRef = useRef(true);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("USEEFFECT DE MES COUILLES");
        const userToken = getCookie("email_validation");
        if (!userToken || userToken === "undefined") {
            isAuthorizedRef.current = false;
            return navigate("/login");
        }
        axios
            .get("/api/test/emailValidation")
            .then(function () {
                return;
            })
            .catch(function (error) {
                isAuthorizedRef.current = false;
                console.log(error);
                return navigate("/login");
            });
    });

    return <>{isAuthorizedRef.current === true ? <Outlet /> : null}</>;
};
export default ProtectedValidation;
