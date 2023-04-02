import { Link } from "react-router-dom";
import "../../styles/AuthNavbar.css";
import "../../styles/AppNavbar.css";

const AuthNavbar = () => {
    return (
        <header id="auth-header">
            <nav id="auth-nav">
                <div id="nav-left">
                    <Link to="/login" id="auth-nav-home">
                        <img id="nav-logo" src="/logo.svg" alt="Logo" />
                        <p id="home-text">ft_transcendence</p>
                    </Link>
                </div>
            </nav>
        </header>
    );
};
export default AuthNavbar;
