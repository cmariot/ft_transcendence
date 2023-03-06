import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getCookie } from "../../Utils/GetCookie";

export const EmailProtectedRoute = () => {
    const navigate = useNavigate();
    const emailValidationCookie = getCookie("email_validation");

    useEffect(() => {
        if (!emailValidationCookie) {
            return navigate("/login");
        }
    });

    if (emailValidationCookie) return <Outlet />;
    return null;
};
