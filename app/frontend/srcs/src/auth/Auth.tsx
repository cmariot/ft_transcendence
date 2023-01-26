import { Outlet } from "react-router-dom";
import AuthNavbar from "./navbar/AuthNavbar";
import AuthFooter from "./footer/AuthFooter";

function Auth() {
    return (
        <>
            <AuthNavbar />
            <Outlet />
            <AuthFooter />
        </>
    );
}
export default Auth;
