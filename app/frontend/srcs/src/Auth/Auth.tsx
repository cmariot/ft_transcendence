import AuthNavbar from "./AuthNavbar";
import AuthFooter from "./AuthFooter";
import { Outlet } from "react-router-dom";

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
