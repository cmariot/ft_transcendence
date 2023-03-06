import { useContext } from "react";

import AuthNavbar from "./AuthNavBar";
import AppNavbar from "./AppNavBar";
import { UserContext } from "../../Contexts/UserProvider";

export const NavBar = () => {
    let user = useContext(UserContext);

    const isConnected: boolean = user.isLogged === true;
    if (isConnected) {
        return <AppNavbar user={user} />;
    } else {
        return <AuthNavbar />;
    }
};
