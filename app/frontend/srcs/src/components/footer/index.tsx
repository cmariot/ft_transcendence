import { useContext } from "react";

import "../../styles/AppFooter.css";
import "../../styles/AuthFooter.css";
import AuthFooter from "./AuthFooter";
import AppFooter from "./AppFooter";
import { UserContext } from "../../contexts/user/UserContext";

export const Footer = () => {
    let user = useContext(UserContext);
    return user.isLogged ? <AppFooter /> : <AuthFooter />;
};
