import { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getCookie } from "./GetCookie";
import axios from "axios";
import { UserContext } from "../contexts/user/UserContext";

export default function ProtectedDoubleAuth() {
    const user = useContext(UserContext);
    const [isDoubleAuthorized, setIsDoubleAuthorized] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userToken = getCookie("double_authentification");
        if (!userToken || userToken === "undefined") {
            return navigate("/");
        }
        (async () => {
            try {
                const [doubleAuthResponse] = await Promise.all([
                    axios.get("/api/authorization/double-authentification"),
                ]);

                if (doubleAuthResponse.status === 200) {
                    setIsDoubleAuthorized(true);
                }
            } catch (error) {
                user.setIsLogged(false);
                user.setIsFirstLog(false);
                navigate("/login");
            }
        })();
    }, [navigate, user]);

    return isDoubleAuthorized === true ? <Outlet /> : null;
}
