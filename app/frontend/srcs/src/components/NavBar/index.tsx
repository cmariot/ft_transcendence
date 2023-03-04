import { useContext } from "react";

import AuthNavbar from "./AuthNavBar";
import AppNavbar from "./AppNavBar";

import { UserContext } from "../../pages/App/App";

export const NavBar = () => {
  let user = useContext(UserContext);

  const isConnected: boolean = !!user;
  if (isConnected) {
    return <AuthNavbar />;
  } else {
    return <AppNavbar user={user} />;
  }
};
