import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "./GetCookie";
import axios from "axios";

const ProtectedDoubleAuth = (props: any) => {
    const navigate = useNavigate();
    let isDoubleAuthorized = true;

    function validateDoubleAuth() {
        const userToken = getCookie("double_authentification");
        if (!userToken || userToken === "undefined") {
            isDoubleAuthorized = false;
            return navigate("/login");
        }
        axios
            .get("/api/test/doubleAuth")
            .then(function () {
                return;
            })
            .catch(function (error) {
                console.log(error);
                isDoubleAuthorized = false;
                navigate("/login");
            });
    }

    useEffect(() => {
        console.log("UseEffect in ProtectedDoubleAuth");
        validateDoubleAuth();
    });

    return <>{isDoubleAuthorized ? props.children : null}</>;
};
export default ProtectedDoubleAuth;
