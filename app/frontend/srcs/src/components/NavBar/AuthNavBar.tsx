import { Link } from "react-router-dom";
import "../../styles/AuthNavbar.css";

const AuthNavbar = () => {
  return (
    <nav id="auth-nav-bar">
      <Link to="/login">ft_transcendence</Link>
    </nav>
  );
};
export default AuthNavbar;
