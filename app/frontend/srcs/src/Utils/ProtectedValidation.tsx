import { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getCookie } from "./GetCookie";
import axios from "axios";
import { UserContext } from "../Contexts/UserProvider";

export default function ProtectedValidation() {
    const user = useContext(UserContext);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userToken = getCookie("email_validation");
        if (!userToken || userToken === "undefined") {
            setIsAuthorized(false);
            return navigate("/");
        }
        (async () => {
            try {
                const [validateEmailResponse] = await Promise.all([
                    axios.get("/api/authorization/email"),
                ]);
                if (validateEmailResponse.status === 200) {
                    setIsAuthorized(true);
                    user.setIsLogged(true);
                    user.setIsFirstLog(true);
                }
            } catch (error) {
                user.setIsLogged(false);
                user.setIsFirstLog(false);
                navigate("/login");
            }
        })();
    }, [navigate, user]);

    return isAuthorized ? <Outlet /> : null;
}
