import { NavBar } from "../../components/NavBar";
import AuthFooter from "../../components/AppFooter/AuthFooter";
import { Outlet } from "react-router-dom";

function Auth() {
  return (
    <>
      <NavBar />
      <Outlet />
      <AuthFooter />
    </>
  );
}
export default Auth;
