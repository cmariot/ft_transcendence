import axios from "axios";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { ImageContext } from "../../contexts/images/ImagesContext";

const AuthNavbar = () => {
    const images = useContext(ImageContext);

    return (
        <header id="auth-header">
            <nav id="auth-nav">
                <div id="nav-left">
                    <Link to="/login" id="auth-nav-home">
                        <img id="nav-logo" src={images.logo} alt="Logo" />
                        <p id="home-text">ft_transcendence</p>
                    </Link>
                </div>
            </nav>
        </header>
    );
};
export default AuthNavbar;
