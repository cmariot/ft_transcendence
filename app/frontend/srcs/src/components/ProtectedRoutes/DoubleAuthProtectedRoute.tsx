import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getCookie } from "../../Utils/GetCookie";

export const DoubleAuthProtectedRoute = () => {
    const navigate = useNavigate();
    const doubleAuthCookie = getCookie("double_authentification");

    useEffect(() => {
        if (!doubleAuthCookie) {
            return navigate("/login");
        }
    });

    if (doubleAuthCookie) return <Outlet />;
    return null;
};
