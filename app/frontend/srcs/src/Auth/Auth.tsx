import { Outlet } from "react-router-dom";
import AuthNavbar from "./AuthNavbar";
import AuthFooter from "./AuthFooter";

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
