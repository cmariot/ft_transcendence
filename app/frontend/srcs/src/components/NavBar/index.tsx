import { useContext } from "react";

import AuthNavbar from "./AuthNavBar";
import AppNavbar from "./AppNavBar";
import { UserContext } from "../../contexts/UserProvider";

export const NavBar = () => {
    let user = useContext(UserContext);

    return user.isLogged && !user.isFirstLog ? <AppNavbar /> : <AuthNavbar />;
};
