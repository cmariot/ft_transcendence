import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AuthNavbar = () => {
    const [logo, setLogo] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const logoResponse = await axios.get("/logo.svg", {
                    responseType: "blob",
                });
                if (logoResponse.status === 200) {
                    var imageUrl = URL.createObjectURL(logoResponse.data);
                    setLogo(imageUrl);
                }
            } catch (error: any) {}
        })();
    }, []);

    return (
        <header id="auth-header">
            <nav id="auth-nav">
                <div id="nav-left">
                    <Link to="/login" id="auth-nav-home">
                        <img id="nav-logo" src={logo} alt="Logo" />
                        <p id="home-text">ft_transcendence</p>
                    </Link>
                </div>
            </nav>
        </header>
    );
};
export default AuthNavbar;
