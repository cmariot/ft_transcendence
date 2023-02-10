import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "./GetCookie";
import axios from "axios";

const ProtectedPage = (props: any) => {
    const navigate = useNavigate();
    let isLoggedInRef = useRef(true);

    useEffect(() => {
        console.log("UseEffect in ProtectedPage");
        const userToken = getCookie("authentification");
        if (!userToken || userToken === "undefined") {
            isLoggedInRef.current = false;
            return navigate("/login");
        }
        axios
            .get("/api/test/isLogged")
            .then(function () {
                return;
            })
            .catch(function (error) {
                isLoggedInRef.current = false;
                return navigate("/login");
            });
    });

    return <>{isLoggedInRef.current === true ? props.children : null}</>;
};

export default ProtectedPage;
