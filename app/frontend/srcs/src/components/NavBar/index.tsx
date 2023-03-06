import { useContext } from "react";

import AuthNavbar from "./AuthNavBar";
import AppNavbar from "./AppNavBar";
import { UserContext } from "../../Contexts/UserProvider";

export const NavBar = () => {
    let user = useContext(UserContext);

    if (user.isLogged) {
        return <AppNavbar />;
    } else {
        return <AuthNavbar />;
    }
};
