import { useContext } from "react";

import AuthFooter from "./AuthFooter";
import AppFooter from "./AppFooter";
import { UserContext } from "../../contexts/UserProvider";

import "../../styles/AppFooter.css";
import "../../styles/AuthFooter.css";

export const Footer = () => {
    let user = useContext(UserContext);
    return user.isLogged ? <AppFooter /> : <AuthFooter />;
};
