import { useContext } from "react";
import { UserContext } from "../../contexts/user/UserContext";

import AuthFooter from "./AuthFooter";
import AppFooter from "./AppFooter";

import "../../styles/AppFooter.css";

export const Footer = () => {
    let user = useContext(UserContext);
    return user.isLogged ? <AppFooter /> : <AuthFooter />;
};
