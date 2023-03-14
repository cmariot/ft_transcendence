import { useContext } from "react";

import { UserContext } from "../../contexts/UserProvider";

import "../../styles/AppFooter.css";
import "../../styles/AuthFooter.css";
import AuthFooter from "./AuthFooter";
import AppFooter from "./AppFooter";

export const Footer = () => {
    let user = useContext(UserContext);
    return user.isLogged ? <AppFooter /> : <AuthFooter />;
};
