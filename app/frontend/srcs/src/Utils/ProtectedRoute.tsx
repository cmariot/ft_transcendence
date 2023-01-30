import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "./GetCookie";

const ProtectedRoute = (props) => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const checkUserToken = () => {
        const userToken = getCookie("authentification");
        if (!userToken || userToken === "undefined") {
            setIsLoggedIn(false);
            return navigate("/login");
        }
        setIsLoggedIn(true);
    };

    useEffect(() => {
        checkUserToken();
    }, [isLoggedIn]);

    return <>{isLoggedIn ? props.children : null}</>;
};
export default ProtectedRoute;
